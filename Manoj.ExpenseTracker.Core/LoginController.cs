using System;
using System.Security.Cryptography;
using System.Text;
using System.Web;

namespace Manoj.ExpenseTracker.Core
{
    public static class LoginController
    {
        public static bool ValidateUser(string username, string password)
        {
            // Check request number from this ip is in allowed range
            //if(!ActionValidator.IsValid(ActionValidator.ActionTypeEnum.FirstVisit))
            //    return false;           

            //read Key Pair (Public + Private Key) from Cache
            var domainKey = (string) HttpRuntime.Cache["KeyPair"];

            var rsa = new RSACryptoServiceProvider();
            rsa.FromXmlString(domainKey);
            var decUsername = Encoding.UTF8.GetString(rsa.Decrypt(ToHexByte(username), false));
            var decPassword = Encoding.UTF8.GetString(rsa.Decrypt(ToHexByte(password), false));

            var nounce = SessionHelper.Nounce;
            if (!String.IsNullOrEmpty(nounce))
            {
                SessionHelper.Nounce = null;
                if (decUsername.StartsWith(nounce) && decPassword.StartsWith(nounce))
                {
                    byte[] hashPassword;
                    const int maxSize = 55;
                    using (var hasher = new SHA512Managed())
                    {
                        var encoder = new ASCIIEncoding();
                        var encoded = encoder.GetBytes(decPassword.Substring(maxSize));
                        hashPassword = hasher.ComputeHash(encoded);
                    }
                    var userId = Convert.ToInt32(
                        ExpenseTrackerController.Db.ExecuteScalar("Sp_ValidateUser", decUsername.Substring(maxSize), hashPassword));
                    if (userId != 0)
                    {
                        SessionHelper.UserId = userId;
                        return true;
                    }
                }
            }
            return false;
        }

        private static byte[] ToHexByte(string str)
        {
            var b = new byte[str.Length / 2];
            for (int y = 0, x = 0; x < str.Length; ++y, x++)
            {
                var c1 = (byte) str[x];
                if (c1 > 0x60) c1 -= 0x57;
                else if (c1 > 0x40) c1 -= 0x37;
                else c1 -= 0x30;
                var c2 = (byte) str[++x];
                if (c2 > 0x60) c2 -= 0x57;
                else if (c2 > 0x40) c2 -= 0x37;
                else c2 -= 0x30;
                b[y] = (byte) ((c1 << 4) + c2);
            }
            return b;
        }

        public static string ToHexString(byte[] byteValue)
        {
            var lookup = new[] { '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F' };
            int i = 0, p = 0, l = byteValue.Length;
            var c = new char[l * 2];
            while (i < l)
            {
                byte d = byteValue[i++];
                c[p++] = lookup[d / 0x10];
                c[p++] = lookup[d % 0x10];
            }
            return new string(c, 0, c.Length);
        }

        public static string GetUniqueKey()
        {
            const int maxSize = 55;
            var chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890".ToCharArray();
            var data = new byte[1];
            var crypto = new RNGCryptoServiceProvider();
            crypto.GetNonZeroBytes(data);
            data = new byte[maxSize];
            crypto.GetNonZeroBytes(data);
            var result = new StringBuilder(maxSize);
            foreach (byte b in data)
            {
                result.Append(chars[b % (chars.Length)]);
            }
            var nounce = result.ToString();
            SessionHelper.Nounce = nounce;
            return result.ToString();
        }
    }
}
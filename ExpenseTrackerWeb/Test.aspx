<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="Test.aspx.cs" Inherits="Manoj.ExpenseTracker.Web.Test" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title></title>
</head>
<body>
    <form id="form1" runat="server">
    <div>
        <asp:ScriptManager runat="server" ID="ScriptManager"></asp:ScriptManager>
    <asp:Panel runat="server" ID="asd" DefaultButton="theReal">
        <asp:TextBox runat="server" ID="text"></asp:TextBox>
        <asp:Button runat="server" ID="ignore" Text="Ignore" OnClientClick="alert('bummer');"/>
        <asp:Button runat="server" ID="theReal" Text="Click Me" OnClientClick="alert('hi');"/>
    </asp:Panel>
    </div>
    </form>
</body>
</html>

public with sharing class AccountController {
    // Fetch account records for LWC
    @AuraEnabled(cacheable=true)
    public static List<Account> getAccountRecords() {
        return [SELECT Id, Name, Industry, Phone FROM Account LIMIT 200];
    }

    // Property for selected accounts (used by Visualforce page)
    public List<Account> selectedAccounts { get; set; }

    // Constructor for PDF generation logic
    public AccountController() {
        String selectedIds = ApexPages.currentPage().getParameters().get('selectedIds');
        if (String.isNotBlank(selectedIds)) {
            List<Id> accountIds = selectedIds.split(',');
            selectedAccounts = [
                SELECT Name, Phone, Industry
                FROM Account
                WHERE Id IN :accountIds
            ];
        } else {
            selectedAccounts = new List<Account>();
        }
    }
}

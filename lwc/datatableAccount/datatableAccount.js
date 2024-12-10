import { LightningElement, wire, track } from 'lwc';
import getAccountRecords from '@salesforce/apex/AccountController.getAccountRecords';

export default class DatatableAccount extends LightningElement {
    @track accounts = [];
    @track filteredAccounts = [];
    @track selectedAccounts = [];

    columns = [
        { label: 'Name', fieldName: 'Name', type: 'text' },
        { label: 'Industry', fieldName: 'Industry', type: 'text' },
        { label: 'Phone', fieldName: 'Phone', type: 'phone' }
    ];

    @wire(getAccountRecords)
    wiredAccounts({ data, error }) {
        if (data) {
            this.accounts = data;
            this.filteredAccounts = data;
        } else if (error) {
            console.error('Error fetching accounts:', error);
            alert('An error occurred while fetching account records.');
        }
    }

    handleSearch(event) {
        const searchKey = event.target.value.toLowerCase();
        this.filteredAccounts = this.accounts.filter((account) =>
            Object.keys(account).some((key) =>
                account[key] && account[key].toString().toLowerCase().includes(searchKey)
            )
        );
    }

    handleRowSelection(event) {
        const selectedRows = event.detail.selectedRows;
        this.selectedAccounts = selectedRows.map((row) => row.Id);
    }

    generatePdf() {
        if (this.selectedAccounts.length === 0) {
            alert('No records selected for PDF generation.');
            return;
        }

        const selectedIds = this.selectedAccounts.join(',');
        window.location.href = `/apex/GeneratePDFPage?selectedIds=${selectedIds}`;
    }
}

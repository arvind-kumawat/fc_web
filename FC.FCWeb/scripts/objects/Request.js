
function Request(totalItems, currentPage, pageSize, maxSize) {
    //this = this;
    this.TotalItems = totalItems ? totalItems : 0;
    this.CurrentPage = currentPage ? currentPage : 1;
    this.MaxSize = maxSize ? maxSize : 5;
    this.PageSize = pageSize ? pageSize : 10;
    this.GroupBy = '';
    this.SortDirection = 'asc';
    this.SortField = 'LoanAccountId';
    this.Criteria = null;
    this.AdvanceFilter = null;
    this.NumberOfPages = this.TotalItems == 0 ? 0 : parseInt(this.TotalItems) / parseInt(this.PageSize) + ((this.TotalItems % this.PageSize > 0) ? 1 : 0);

    // Setter
    this.set = function (params) {
        this.TotalItems = params.TotalItems ? params.TotalItems : 0;
        this.CurrentPage = params.CurrentPage ? params.CurrentPage : 1;
        this.MaxSize = params.maxSize ? params.maxSize : 5;
        this.PageSize = params.PageSize ? params.PageSize : 10;
        this.NumberOfPages = this.TotalItems == 0 ? 0 : this.TotalItems / this.PageSize + ((this.TotalItems % this.PageSize > 0) ? 1 : 0);
    }

    // Getter
    this.get = function () {
        //console.log("Request.Get Called ")
        return {
            TotalItems: this.TotalItems,
            CurrentPage: this.CurrentPage,
            MaxSize: this.MaxSize,
            PageSize: this.PageSize,
            GroupBy: this.GroupBy,
            SortDirection: this.SortDirection,
            SortField: this.SortField,
            Criteria: this.Criteria,
            AdvanceFilter: this.AdvanceFilter,
            NumberOfPages: this.NumberOfPages
        };
    }
};

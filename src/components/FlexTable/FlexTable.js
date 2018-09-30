import React, { Component } from 'react';
import './FlexTable.css';

class FlexTable extends Component {
  handleToggleCollapse(rowIndex) {
    const openCollapse = window.$('.collapse.show');
    const wantedCollapse = window.$(`#rowCollapse_${rowIndex}`);
    const wantedTableRow = window.$(`#BodyRow_${this.props.tableName}_${rowIndex}`);
    let heightOfOpenCollapse = 0;
    if (openCollapse.length && (openCollapse.offset().top < wantedTableRow.offset().top)) {
      heightOfOpenCollapse = openCollapse.height();
    }
    openCollapse.collapse('hide');
    wantedCollapse.collapse('toggle');
    window.$('html, body').stop().animate({
      scrollTop: wantedTableRow.offset().top - heightOfOpenCollapse,
    }, 700);
  }

  render() {
    const { tableName, headColumns, bodyRows, striped, hover, collapse } = this.props;
    this.handleToggleCollapse = this.handleToggleCollapse.bind(this);
    let tableClass = '';
    if (striped) tableClass += ' flex-table-striped';
    if (hover) tableClass += ' flex-table-hover';
    if (!headColumns) tableClass += ' flex-table-columnHead';
    return (
      <div key={tableName} className="flex-table">
        {headColumns ? (
          <div className="flex-table-row flex-table-head">
            {headColumns.map((headColumn, index) => (
              <div key={`HeadRow_${index}`} className="flex-table-cell">
                <div>
                  {headColumn}
                </div>
              </div>
            ))}
          </div>
        ) : null}

        {bodyRows.map((bodyRow, rowIndex) => (
          <div key={`BodyRow_${rowIndex}`} id={`BodyRow_${tableName}_${rowIndex}`} className={tableClass}>
            <div role="row" className={collapse ? 'flex-table-row cursorPointer' : 'flex-table-row'}
                 onClick={collapse ? () => { this.handleToggleCollapse(rowIndex); } : null}>
              {bodyRow.map((column, columnIndex) => (
                <div key={`BodyColumn_${columnIndex}`} className="flex-table-cell">
                  {column}
                </div>
              ))}
            </div>
            {collapse ? (
              <div id={`rowCollapse_${rowIndex}`} className="collapse">
                <div className="w-100 position-relative">
                  <i role="button" className="fas fa-times flex-table-collapse-close"
                     onClick={() => { this.handleToggleCollapse(rowIndex); }} />
                  {collapse[rowIndex]}
                </div>
              </div>
            ) : null}
          </div>
        ))}
      </div>
    );
  }
}

export default FlexTable;
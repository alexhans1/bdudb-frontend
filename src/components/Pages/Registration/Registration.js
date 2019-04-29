/* eslint-disable camelcase */
import React, { Component } from 'react';
import moment from 'moment';
import { connect } from 'react-redux';
import Currency from 'react-currency-formatter';
import BootstrapTable from 'react-bootstrap-table-next';
import cellEditFactory, { Type } from 'react-bootstrap-table2-editor';
import { attendanceStatuses, successTypes } from '../../../constants/applicationConstants';
import './Registration.scss';
import FieldEditor from './FieldEditor';
import { patchRegistration } from '../../../actions/RegistrationActions';

const mapStateToProps = (
  { user },
  {
    match: {
      params: { id: registrationId },
    },
  },
) => {
  const regUser = user.users.find(
    ({ tournaments }) =>
      tournaments &&
      tournaments.find(({ _pivot_id }) => _pivot_id === parseInt(registrationId, 10)),
  );
  return {
    isAdmin: user.authenticatedUserId
      ? user.users.find(({ id }) => user.authenticatedUserId === id).position === 1
      : false,
    authenticatedUserId: user.authenticatedUserId,
    user: regUser,
    userList: user.users,
    tournament: regUser
      ? regUser.tournaments.find(({ _pivot_id }) => _pivot_id === parseInt(registrationId, 10))
      : null,
  };
};

const mapDispatchToProps = {
  patchRegistration,
};

class Registration extends Component {
  constructor(props) {
    super(props);
    this.handleRegUpdate = this.handleRegUpdate.bind(this);
  }

  handleRegUpdate(value, name) {
    if (value === undefined || !name) return;
    const { tournament, patchRegistration: updateReg } = this.props;

    updateReg(tournament._pivot_id, {
      [name]: value,
    });
  }

  render() {
    const {
      user,
      tournament,
      isAdmin,
      authenticatedUserId,
      userList,
      history,
      match: {
        params: { id: regId },
      },
    } = this.props;
    if (!user || !tournament)
      return (
        <div className="container">
          <h2 className="py-4">
            Registration not found. You might not have permission to see this registration.
          </h2>
        </div>
      );

    const attendanceStatusObj = attendanceStatuses.find(
      statusObj => statusObj.id === tournament._pivot_attended,
    );
    const attendanceStatus = attendanceStatusObj ? attendanceStatusObj.label : '';
    const dateFormat = 'DD.MM.YYYY';
    const startdate = tournament.startdate ? moment(tournament.startdate).format(dateFormat) : '';
    const enddate = tournament.enddate ? moment(tournament.enddate).format(dateFormat) : '';
    const partner1 = userList.find(({ id }) => id === tournament._pivot_partner1);
    const partner2 = userList.find(({ id }) => id === tournament._pivot_partner2);
    let success = tournament._pivot_attended === 1 ? 'none' : null;
    const successObj = successTypes.find(({ id }) => id === tournament._pivot_success);
    if (successObj) success = successObj.label;

    const registrationTableRows = [
      {
        header: 'User',
        field: user.vorname && user.name ? `${user.vorname} ${user.name}` : null,
      },
      {
        header: 'Tournament',
        field: tournament.name,
      },
      {
        header: 'Date',
        field: tournament.startdate && tournament.startdate ? `${startdate} - ${enddate}` : null,
      },
      {
        header: 'Role',
        field: tournament._pivot_role,
        editType: Type.SELECT,
        fieldName: 'role',
        options: [{ id: 'judge', label: 'judge' }, { id: 'speaker', label: 'speaker' }],
      },
      {
        header: 'Team Name',
        field: tournament._pivot_teamname,
        editType: Type.TEXT,
        fieldName: 'teamname',
      },
      {
        header: 'Comment',
        field: tournament._pivot_comment,
        editType: Type.TEXT,
        fieldName: 'comment',
      },
      {
        header: 'Independent',
        field: tournament._pivot_is_independent ? 'Yes' : 'No',
        editType: Type.CHECKBOX,
        fieldValue: tournament._pivot_is_independent,
        fieldName: 'is_independent',
      },
      {
        header: 'Funding',
        field: tournament._pivot_funding ? 'Yes' : 'No',
        editType: Type.CHECKBOX,
        fieldValue: tournament._pivot_funding,
        fieldName: 'funding',
      },
      {
        header: 'Costs',
        field:
          tournament._pivot_price_owed || tournament._pivot_price_paid ? (
            <Currency quantity={parseFloat(tournament._pivot_price_owed, 10) || 0} currency="EUR" />
          ) : null,
        editType: Type.TEXT,
        fieldName: 'price_owed',
      },
      {
        header: 'Price paid',
        field:
          tournament._pivot_price_owed || tournament._pivot_price_paid ? (
            <Currency quantity={parseFloat(tournament._pivot_price_paid, 10) || 0} currency="EUR" />
          ) : null,
        editType: Type.TEXT,
        fieldName: 'price_paid',
      },
      {
        header: 'Debt',
        field:
          tournament._pivot_price_owed || tournament._pivot_price_paid ? (
            <span
              className={
                tournament._pivot_price_owed - tournament._pivot_price_paid > 0
                  ? 'text-danger'
                  : null
              }
            >
              <Currency
                quantity={
                  parseFloat(tournament._pivot_price_owed - tournament._pivot_price_paid, 10) || 0
                }
                currency="EUR"
              />
            </span>
          ) : null,
      },
      {
        header: 'Status',
        field: attendanceStatus,
        editType: Type.SELECT,
        fieldValue: tournament._pivot_attended,
        fieldName: 'attended',
        options: attendanceStatuses,
      },
      {
        header: 'Success',
        field: success,
        editType: Type.SELECT,
        fieldValue: tournament._pivot_success,
        fieldName: 'success',
        options: successTypes,
      },
      {
        header: 'Points',
        field: tournament._pivot_attended === 1 ? tournament._pivot_points : null,
      },
      {
        header: tournament._pivot_partner2 ? 'Partner 1' : 'Partner',
        field: partner1 ? `${partner1.vorname} ${partner1.name}` : null,
        fieldValue: tournament._pivot_partner1,
      },
      {
        header: 'Partner 2',
        field: partner2 ? `${partner2.vorname} ${partner2.name}` : null,
        fieldValue: tournament._pivot_partner2,
      },
    ].filter(({ field }) => field !== null);

    return (
      <div id="registration" className="container">
        <i
          role="button"
          className="mt-1 py-4 cursorPointer fas fa-arrow-left d-none d-md-block"
          onClick={() => {
            history.goBack();
          }}
        />
        {user && user.tournaments ? (
          <div className="row">
            <div className="col-12 col-md-8 col-lg-6 col-xl-5 offset-md-1">
              <h1 className="py-4">Registration {regId}</h1>
              <BootstrapTable
                bootstrap4
                keyField="id"
                data={registrationTableRows.map((row, i) => ({
                  id: i,
                  ...row,
                }))}
                columns={[
                  {
                    dataField: 'header',
                    text: '',
                    style: { fontWeight: 'bold' },
                    editable: false,
                  },
                  {
                    dataField: 'field',
                    text: '',
                    editorRenderer: (
                      editorProps,
                      value,
                      { editType, options, fieldName, fieldValue },
                    ) => {
                      if (!editType) return null;
                      if (value.props && value.props.quantity) value = value.props.quantity;
                      return (
                        <FieldEditor
                          fieldName={fieldName}
                          fieldValue={fieldValue}
                          type={editType}
                          value={value}
                          options={options}
                          handleChange={this.handleRegUpdate}
                        />
                      );
                    },
                  },
                ]}
                cellEdit={cellEditFactory({
                  mode: 'click',
                  blurToSave: true,
                  nonEditableRows: () =>
                    registrationTableRows.reduce((nonEditRowIds, { editType }, i) => {
                      // check if the current user can edit this registration at all
                      if (!isAdmin && authenticatedUserId !== user.id) return [...nonEditRowIds, i];
                      if (!editType) nonEditRowIds.push(i);
                      return nonEditRowIds;
                    }, []),
                })}
                bordered={false}
              />
            </div>
          </div>
        ) : null}
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Registration);

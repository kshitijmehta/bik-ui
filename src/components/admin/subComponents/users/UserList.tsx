import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { AppState, setUser, UserInformation, updateUserDiscount } from 'reducers';
import { User } from 'types';
import { AdminProductList } from 'components/admin/AdminProductList';
import { SubProducts } from 'appConstants';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { NotificationContainer } from 'components/shared';

interface Props{
  addEditToggle: Function;
}

const UserList: React.FunctionComponent<Props> = (props: Props) => {
  const dispatch = useDispatch();
  const stateData = useSelector<AppState, User[]>(state => state.user.allUsers || []);
  const productColumns = [
    {
      name: 'Email',
      selector: 'emailAddress',
      sortable: false,
    },
    {
      name: 'Mobile',
      selector: 'mobile',
      sortable: true,
    },
    {
      name: 'First Name',
      selector: 'firstName',
      sortable: true,
    },
    {
      name: 'Last Name',
      selector: 'lastName',
      sortable: true,
    },
    {
      name: 'View Details',
      sortable: false,
      cell: (row:  User) => {
        return <button type="submit" className="uk-button-small uk-button-primary" onClick={() => {dispatch(setUser(row));props.addEditToggle(true)}}>
          <span>View</span>
        </button>
      }
    },
  ]

  return (
    <AdminProductList
      productColumns={productColumns}
      productType={SubProducts.USERS}
      stateData={stateData}
      ExpandableComponent={ExpandableComponent}
      searchPlaceholder="Search Email / Mobile"
      expandableRows={true} />
  )
}

const ExpandableComponent: React.FunctionComponent<any> = ({ data }) => {
  const dispatch = useDispatch();
  const { emailAddress, discount }: User = data;
  const userActionStatus = useSelector<AppState, UserInformation>(state => state.user);

  const userDiscountQuickViewFormik = useFormik({
    initialValues: {
      emailAddress: emailAddress || '',
      discount: discount || ''
    },
    validationSchema: Yup.object({
      emailAddress: Yup.string().required('Required'),
      discount: Yup.string().required('Required')
    }),
    onSubmit: (value) => {
      dispatch(updateUserDiscount(value.discount || '0', value.emailAddress.toString()));
    }
  });
  return (
    <form onSubmit={userDiscountQuickViewFormik.handleSubmit} className="quick-edit-admin uk-grid-medium uk-child-width-1-1" uk-grid="true">
      <fieldset className="uk-fieldset">
        <div className="uk-grid-small uk-child-width-1-1 uk-child-width-1-3@s" uk-grid="true">
          <div>
            <label>
              <div className="uk-form-label">Discount Percentage</div>
              <input className="uk-input " id="discount" type="input"
                {...userDiscountQuickViewFormik.getFieldProps('discount')} />
              {
                userDiscountQuickViewFormik.touched.discount && userDiscountQuickViewFormik.errors.discount ? (
                  <span className="uk-text-danger">{userDiscountQuickViewFormik.errors.discount}</span>
                ) : ''
              }
            </label>
          </div>
          <div>
            <label>
              <div className="uk-form-label">Update</div>
              <button type="submit" className="uk-button uk-button-primary ">
                {
                  userActionStatus._isLoading &&
                  <img className="login-button-padding" src="tail-spin.svg" />
                }
                <span>Save</span>
              </button>
            </label>
          </div>
        </div>
        <div className="extended-component-notification">
        {userDiscountQuickViewFormik.isSubmitting && <NotificationContainer {...userActionStatus}/>}
        </div>
      </fieldset>
    </form>
  )
}

export {
  UserList
}
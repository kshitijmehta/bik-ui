import React from 'react';
import { useHistory } from 'react-router-dom';

const ReturnPolicy: React.FunctionComponent = () => {
  const history = useHistory();
  return (
    <main>
      <section className="uk-section uk-section-small">
        <div className="uk-container">
          <div className="uk-grid-medium uk-child-width-1-1" uk-grid="true">
            <section className="uk-text-center">
              <ul className="uk-breadcrumb uk-flex-center uk-margin-remove">
                <li><a onClick={() => history.push('/')}>Home</a></li>
                <li><span>Refund Policy</span></li>
              </ul>
            </section>
            <section>
              <div>
                <article className="uk-card uk-card-default uk-card-body uk-article tm-ignore-container">
                  {/* <header className="uk-text-center"><h1 className="uk-article-title">Refund Policy</h1></header> */}
                  <div className="uk-article-body">
                    <h2 className="uk-text-center">Exchange / Return Policy</h2>
                    <p>
                      Our return policy lasts 10 days from the date of delivery.
                      <br />
                      <br />
                      To complete your return, Please log into your Basickart account and raise a return request in your order summary page.
                      <br />
                      <br />
                      After receiving your request , we will schedule a reverse pickup from your shipping address and our courier partner will contact you for picking the product back.
                      <br />
                      <br />
                      To be eligible for a return, your item must be:
                      <ul>
                        <li>
                        Unused and in the same condition that you received it
                        </li>
                        <li>
                        In the original packaging
                        </li>
                        <li>
                        Any item not in its original condition is damaged or missing parts for reasons not due to our error will not be exchanged.
                        </li>
                        <li>
                        Items such as lingerie, bindi, cosmetics are not returnable.
                        </li>
                      </ul>


                    </p>
                    <h2 className="uk-text-center">Refunds (if applicable)</h2>
                    <p>
                      Once your return is received, we will inspect the product.
                    <br />
                      <br />
                      If its approved, then your refund will be initiated to your original payment method. A notification will be sent to you confirming the same.In case of cash on delivery our team will contact you and we will reverse the payment as per your directions.
                    <br /><br />
                    In case of rejection, We will notify you via your registered email or mobile no. You can contact us back for any further communication.
                      </p>
                    <h2 className="uk-text-center">Cancellations </h2>
                    <p>
                    You can cancel your orders before it is shipped by clicking on CANCEL ITEM
                    or contacting us, the full invoice amount will be refunded to your original payment method. Once the item is shipped it cannot be cancelled.

                    <br /><br />
                    For International returns buyer will have to pay for return postage and once we receive the product at our warehouse after inspection we will refund the payment through original payment method.
                      </p>
                  </div>
                </article>
              </div>
            </section>
          </div>
        </div>
      </section>

    </main>
  )
}
export {
  ReturnPolicy
}
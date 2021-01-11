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
                <li><span>Shop Policy</span></li>
              </ul>
            </section>
            <section>
              <div className="shop-policy">
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
                      <h2 className="uk-text-center">Taxes & Duties</h2>
                    <p>
                    For Indian Customers:
                    <br/>
                    Product prices displayed are inclusive of all taxes and duties.

                    <br /><br />
                    For International Customers:
                    <br/>
                    We ship on the DDU (Delivery Duty Unpaid) basic which means prices displayed are exclusive of all import taxes and duties.As a buyer you are liable to pay any import duty, customs and local sales taxes levied by the country you are in.

                    </p>
                    <h2 className="uk-text-center">Privacy Policy</h2>
                    <p>
                    We value the trust you place in us. That's why we insist upon the highest standards for secure transactions and customer information privacy. Please read the following statement to learn about our information gathering and dissemination practices.
                      <br />
                      <br />
                      Note:Our privacy policy is subject to change at any time without notice. To make sure you are aware of any changes, please review this policy periodically. 
                      By visiting this Website you agree to be bound by the terms and conditions of this Privacy Policy.By mere use of the Website, you expressly consent to our use and disclosure of personal information provided by you in accordance with this Privacy Policy. This Privacy Policy is incorporated into and subject to the Terms of Use.
                      <br />
                      <br />
                      <ul>
                        <li>
                        Collection of Personally Identifiable Information and other Information
                        <br/>
                        When you use our Website, we collect and store your personal information which is provided by you from time to time. Our primary goal in doing so is to provide you a safe, efficient, smooth and customized experience. This allows us to provide services and features that most likely meet your needs, and to customize our Website to make your experience safer and easier. More importantly, while doing so we collect personal information from you that we consider necessary for achieving this purpose. 
                        <br/>
                        In general, you can browse the Website without telling us who you are or revealing any personal information about yourself. Once you give us your personal information, you are not anonymous to us. Where possible, we indicate which fields are required and which fields are optional. You always have the option to not provide information by choosing not to use a particular service or feature on the Website.
                        </li>
                        <li>
                        Use of Demographic / Profile Data / Your Information
                        <br/>
                        We use your personal information in handling and fulfilling orders, enhancing customer experience, resolve disputes; troubleshoot problems; help promote a safe service; collect money; measure consumer interest in our products and services, inform you about online and offline offers, products, services, and updates; customize and enhance your experience; detect and protect us against error, fraud and other criminal activity; enforce our terms and conditions; and as otherwise described to you at the time of collection
                        </li>
                        <li>
                        We may disclose personal information to third parties. This disclosure is required for us to provide you access to our Services, for fulfillment of your orders, or for enhancing your experience, or to comply with our legal obligations, to enforce our User Agreement, to facilitate our marketing and advertising activities, or to prevent, detect, mitigate, and investigate fraudulent or illegal activities related to our Services. We do not disclose your personal information to third parties for their marketing and advertising purposes.
                        </li>
                        <li>
                        Security Precautions
                        <br/>
                        Our Website has stringent security measures in place to protect the loss, misuse, and alteration of the information under our control. Whenever you change or access your account information, we offer the use of a secure server. Once your information is in our possession we adhere to strict security guidelines, protecting it against unauthorized access. 
                        </li>
                        <li>
                        Choice/Opt-Out
                        <br/>
                        We provide all users with the opportunity to opt-out of receiving non-essential (promotional, marketing-related) communications from us on behalf of our partners, and from us in general, after setting up an account. 
                        <br/>
                        If you want to remove your contact information from all basickart.com lists and newsletters, please visit unsubscribe
                        </li>
                        <li>
                        Your Consent by using the Website and/ or by providing your information, you consent to the collection and use of the information you disclose on the Website in accordance with this Privacy Policy, including but not limited to Your consent for sharing your information as per this privacy policy. . If you disclose any personal information relating to other people to us, you represent that you have the authority to do so and to permit us to use the information in accordance with this Privacy Policy. 
                        </li>
                      </ul>
                      <br/>
                      <br/>
                      If we decide to change our privacy policy, we will post those changes on this page so that you are always aware of what information we collect, how we use it, and under what circumstances we disclose it. 


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
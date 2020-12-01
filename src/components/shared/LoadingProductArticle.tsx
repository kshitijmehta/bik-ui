import React from 'react';

interface Props{
  keyIndex: number
}
const LoadingProductArticle: React.FunctionComponent<Props> = (props: Props) => {
  return (
    <article key={props.keyIndex} className="tm-product-card">
      <div className="tm-product-card-media">
        <div className="tm-ratio tm-ratio-4-3">
          <a className="tm-media-box" href="bindi-product.html">
            <figure className="tm-media-box-wrap">
              <div className="ph-item">
                <div className="ph-picture"></div>
              </div>
            </figure>
          </a>
        </div>
      </div>
      <div className="tm-product-card-body">
        <div className="tm-product-card-info">
          <div className="uk-text-meta uk-margin-xsmall-bottom">
            <div className="ph-item">
              <div>
                <div className="ph-row">
                  <div className="ph-col-4"></div>
                  <div className="ph-col-8 empty"></div>
                  <div className="ph-col-6"></div>
                  <div className="ph-col-6 empty"></div>

                  <div className="ph-col-12 empty"></div>
                </div>
              </div>
              <div className="ph-col-1">
                <div className="ph-avatar"></div>
              </div>
            </div></div>
        </div>
      </div>
    </article>
  )
}

export {
  LoadingProductArticle
}
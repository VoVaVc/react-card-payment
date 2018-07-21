import React, { Component } from 'react';
import './index.css';

// plugins
import CardInfo from 'card-info';
import * as CardValidator from 'card-validator';

// get all logos file from card-info plugin to use it further
const LogosRaw = require.context('card-info/dist/', true, /\.png/);
const LogosRawSvg = require.context('card-info/dist/', true, /\.svg/);
var Logos = {};

LogosRaw.keys().forEach(function(key){
  var base64 = LogosRaw(key);
  Logos[key] = base64;
});

// if there are svg, ovverride png
LogosRawSvg.keys().forEach(function(key){
  var base64 = LogosRawSvg(key);
  Logos[key] = base64;
});

export default class ReactCardPayment extends Component {
  constructor(props){
    super(props);

    this.state = {
      card: {
        number: '',
        name: '',
        month: '',
        year: '',
        cvv: '',
      },

      bankInfo : {},
      valid: false,

      background: 'linear-gradient(135deg, #eeeeee, #dddddd)',
    }

    CardInfo.setDefaultOptions({
      banksLogosPath: 'banks-logos/',
      brandsLogosPath: 'brands-logos/'
    });

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
  }

  handleSubmit(event){
    event.preventDefault();
    if(this.state.valid){
      this.props.onSubmit();
    }
  }

  setCardState(name, value, callback){
    let card = {...this.state.card};
    card[name] = value;

    let caller = () => {
      if(typeof callback === 'function'){
        callback.call(this);
      }

      this.validate();
    };

    this.setState({card}, caller);
  }

  handleChange(event){
    const target = event.target;

    switch (target.name) {
      case 'cardnumber':
        // contribute this settings to CardInfo plugin in future
        let cardInfo = new CardInfo(target.value);

        this.setState({
          bankInfo: cardInfo,
          background: cardInfo.backgroundGradient
        });

        let niceNumber = cardInfo.numberNice;

        if(niceNumber.length > 19){
          niceNumber =  niceNumber.slice(0, 19) + ' ' + niceNumber.slice(19)
        }

        this.setCardState('number', niceNumber);
        break;
      case 'cc-exp-month':
        this.setMonth(target.value)
        break;
      case 'cc-exp':
        this.setYear(target.value);
        break;
      case 'cvc':
        this.setCardState('cvv', target.value);
        break;
      case 'ccname':
        this.setCardState('name', target.value.toUpperCase());
        break;
      default:
        break;
    }
  }

  getCurrYear(){
    return parseInt(new Date().getFullYear().toString().substr(2), 10)
  }

  setMonth(month, blur){
    if(month){
      if(month.length > 2){
        month = month.toString().substr(-2);
      }

      if(month > 12){
        month = 12;
      } else if(!isNaN(parseInt(month, 10)) && month < 0){
        month = 1;
      }

      if(month < 10 && blur){
        month = '0'+month;
      }

      if(this.state.card.year && !blur){
        this.checkFuture();
      }
    }

    this.setCardState('month', month);
  }

  handleBlur(event){
    let target = event.target, value;

    if(target.value < 10 && target.value.length < 2){
      if(target.name === 'cc-exp-month'){
        this.setMonth(value ? value : this.state.card.month, true);
        this.checkFuture();
      } else if(target.name === 'cc-exp'){
        this.setYear(value ? value : this.state.card.year, true);
      }
    }
  }

  setYear(year, blur){
    let callback;

    if(year){
      var currYear = this.getCurrYear();

      if(year.length > 2){
        year = year.toString().substr(-2);
      }

      if(year < 10 && blur){
        year = '0'+year;
      }

      if(year <= currYear && year.length > 1){
        year = currYear;
        // here we need to check correct month
        callback = () => { this.checkFuture(year) }
      }
    }

    this.setCardState('year', year, callback);
  }

  checkFuture(year){
    return new Promise((resolve, reject) => {
      year = year ? year : this.state.card.year;

      let month = this.state.card.month,
          currYear = this.getCurrYear(),
          currMonth = new Date().getMonth();

      if(year == currYear && month < currMonth){
        // for this year, minimal month is current month, so set it
        this.setMonth(currMonth, true);
      }
    });
  }

  getImage(path){
    if(path){
      return Logos['./'+path];
    }
  }

  validate(){
    let valid = (
      CardValidator.number(this.state.card.number).isValid
      && CardValidator.expirationMonth(this.state.card.month.toString()).isValid
      && CardValidator.expirationYear(this.state.card.year.toString(), new Date().getFullYear()).isValid
      && CardValidator.cvv(this.state.card.cvv).isValid
      && this.state.card.name.length > 3
    );

    this.setState({
      valid: valid
    });
  }

  render() {
    return (
      <div className={'cardWrap ' + (this.state.valid ? 'valid' : '')} style={{background: this.state.background}}>
        <form onSubmit={this.handleSubmit} className={this.state.bankInfo.backgroundLightness}>
          <div className="bankLogo">
            {this.state.bankInfo.bankLogo &&
              <img src={this.getImage(this.state.bankInfo.bankLogo)} alt="Bank logotype"/>
            }
          </div>
          <div className="row">
            <label>{this.props.labels.cardNumber}</label>

            <input type="phone" value={this.state.card.number}
              onInput={this.handleChange} placeholder-char="_"
              placeholder={this.props.placeholders.cardNumber}
              name="cardnumber" autoComplete="cc-number" maxLength="23"
            />
          </div>
          <div className="row">
            <div className="part">
              <label>{this.props.labels.month}</label>
              <input type="number" value={this.state.card.month}
                onInput={this.handleChange}
                onBlur={this.handleBlur} placeholder={this.props.placeholders.month}
                min="1" max="12" maxLength="2" name="cc-exp-month" autoComplete="cc-exp"
              />
            </div>
            <div className="part sepLine">
              <span></span>
            </div>
            <div className="part">
              <label>{this.props.labels.year}</label>
              <input type="number" value={this.state.card.year}
                onInput={this.handleChange} onBlur={this.handleBlur}
                placeholder={this.props.placeholders.year}
                min="0" max="99" maxLength="2" name="cc-exp" autoComplete="cc-exp"
              />
            </div>
            <div className="part right">
              <label>{ 'CVV' }</label>
              <input type="password" value={this.state.card.cvv}
                onInput={this.handleChange} placeholder={this.props.placeholders.cvv}
                name="cvc" maxLength="3" autoComplete="cc-cvc"
              />
            </div>
          </div>
          <div className="row">
            <label>{this.props.labels.cardHolder}</label>
            <input type="text" value={this.state.card.name}
              onInput={this.handleChange} placeholder={this.props.placeholders.cardHolder}
              name="ccname" autoComplete="cc-name"
            />
            {
              this.state.bankInfo.bankLogo &&
              <img src={this.getImage(this.state.bankInfo.brandLogo)}
                className="brandLogo right" alt="Payment system logo"
              />
            }
          </div>
          <div className="submit">
            <button type="submit">{this.props.labels.button}</button>
          </div>
        </form>
      </div>
    );
  }
}

ReactCardPayment.defaultProps = {
  labels: {
    cardNumber: 'Card number',
    month: 'Month',
    year: 'Year',
    cardHolder: 'Cardholder name',
    button: 'pay'
  },

  placeholders: {
    cardNumber: '0000 0000 0000 0000',
    month: '00',
    year: '00',
    cardHolder: 'JOHN DOE',
    cvv: '000'
  },

  onSubmit(){
    console.warn('<ReactCardPayment> -> there is no callback function for onSubmit, maybe you forgot to provide it?');
  }
};

ReactCardPayment.displayName = 'ReactCardPayment';

export default ReactCardPayment;

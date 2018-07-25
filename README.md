# ReactCardPayment

[![npm](https://img.shields.io/npm/v/vue-card-payment.svg)](https://www.npmjs.com/package/vue-card-payment) [![vue2](https://img.shields.io/badge/vue-2.x-brightgreen.svg)](https://vuejs.org/)

> Awesome credit card payment form

![DEMO](https://media.giphy.com/media/46zASYmXsfOUprZXcr/giphy.gif)

## Installation

```bash
npm install --save react-card-payment
```

## Usage

### with Webpack or Rollup

```js
import ReactCardPayment from 'react-card-payment';
```

then, place this one in a place you want payment form to appear
```html
  <ReactCardPayment/>
```

## Properties

### Labels
| Prop        | Data type           | Default  |
| ------------- |:-------------:| -----:|
| labelCardnumber         | string | Card number |
| labelMonth              | string | Month |
| labelYear               | string | Year |
| labelCardHolder         | string | Cardholder name |
| button              | string | Pay |

### Placeholders
| Prop        | Data type           | Default  |
| ------------- |:-------------:| -----:|
| placeholderCardnumber         | string | 0000 0000 0000 0000 |
| placeholderMonth              | string | 00 |
| placeholderYear               | string | 00 |
| placeholderCardHolder         | string | JOHN DOE |
| placeholderCvv              | string | 000 |

### Events
| Event        | Description          
| ------------- |:-------------:|
| onSubmit      | fires when form is submitted |

## Example with settings
```html
  <ReactCardPayment {...{
    labelCardNumber: "Card number",
    labelMonth: "Month",
    labelYear: "Year",
    labelCardHolder: "Cardholder name",
    button: "Pay",

    placeholderCardnumber: "0000 0000 0000 0000",
    placeholderMonth: "00",
    placeholderYear: "00",
    placeholderCardHolder: "JOHN DOE",
    placeholderCvv: "000"
  }} onSubmit={alert('it was submitted')}/>
```


### Browser

```html
<!-- Include after Vue -->
<!-- Local files -->
<link rel="stylesheet" href="vue-card-payment/dist/vue-card-payment.css"></link>
<script src="vue-card-payment/dist/vue-card-payment.js"></script>

<!-- From CDN -->
<link rel="stylesheet" href="https://unpkg.com/vue-card-payment/dist/vue-card-payment.css"></link>
<script src="https://unpkg.com/vue-card-payment"></script>
```

## Thanks
[iserdmi](https://www.npmjs.com/~iserdmi) for [card-info](https://www.npmjs.com/package/card-info) plugin, this plugin is primary-based on it
[braintree](https://www.npmjs.com/~braintree) for [card-validator](https://www.npmjs.com/package/card-validator) plugin, this one used here for validation needs

## License

[MIT](http://opensource.org/licenses/MIT)

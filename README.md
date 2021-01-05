# js-dataform
Adds javascript support to compose object by deep form structure. The method dataform() uses javascript to serializes a form into a JavaScript Object. With this library you can also specific types to mutate data, appending the type with a colon.

![GitHub package.json version](https://img.shields.io/github/package-json/v/maviniciuus/js-dataform)
[![](https://img.shields.io/github/languages/code-size/badges/shields.svg)](https://github.com/maviniciuus/js-dataform) 
[![](https://img.shields.io/github/last-commit/google/skia.svg)](https://github.com/maviniciuus/js-dataform) 
![GitHub Repo stars](https://img.shields.io/github/stars/maviniciuus/js-dataform)
![GitHub issues](https://img.shields.io/github/issues/maviniciuus/js-dataform)


## WHO SHOULD USE:
Recommended for all those who want to collect and structure data from an HTML form.
  
## GETTING STARTED:
You need to include in HTML file! Use script with CDN src:  
```html
//include lib
<script type="text/javascript" src="//cdn.jsdelivr.net/gh/maviniciuus/dist/jsdataform.min.js"></script>
```

Your **javascript** code look likes this:
```html
<script>
//get form by id
var my_form = document.getElementById('my_form');

//function to handle submit and get form data to print at console
function handle_submit(event) {
  var myform_data = dataform.parse(event.target);

  //@TODO make awesome things with form data
  console.log(myform_data);
}

// add listener to handle form submit event
document.getElementById("my_form").addEventListener("submit", handle_submit);
</script>
```

## DOC:
Everything you need to know about dataform you find [HERE](https://github.com/maviniciuus/js-dataform/blob/master/doc/DOC.md). Something is missing? Open an issue right now...

## LOOKING FOR SAMPLES:
Clone de repo and look samples folder. I did two samples, `basic_html` and `bootstrap`;

## DEPENDENDENCIES:
- Proudly, with 3Kb, running with no dependencies.

## LICENSE:
Developed by Marcus Vinícius Mendes Gonçalves, during javascript research and study.
- [MIT License](https://github.com/maviniciuus/js-dataform/blob/master/LICENSE)

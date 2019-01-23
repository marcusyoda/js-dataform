  
## DOCUMENTATION:

### GETTING STARTED:
You need to include in HTML file! Use script with CDN src:  
```html
//include lib
<script type="text/javascript" src="//cdn.jsdelivr.net/gh/maviniciuus/js-dataform/dataform.min.js"></script>
```

> #### PARSE VALUES WITH :types
> All attribute values are strings by default. But you can force values to be parsed with specific types by appending the type with a colon.

### HTML FORM:
```html
<form id="form">
      <fieldset>
        <legend>System</legend>
        <p>
          <label for="codigo:int">CODIGO</label><br />
          <input name="codigo:int" value="1" />
        </p>
        <p>
          <label for="profile[roles]">ROLES</label><br />
          <input type="checkbox" name="profile[roles][admin]" /> ADMIN
          <input type="checkbox" name="profile[roles][standard]" /> STANDARD
          <input type="checkbox" name="profile[roles][guest]" /> GUEST
        </p>
        <p>
          <label for="tags:comma_split">TAGS</label><br />
          <textarea name="tags:comma_split">tag1,tag2,tag3,tag4,tag5</textarea>
        </p>
        <p>
          <label for="options:object">OPTIONS</label><br />
          <textarea name="options:object">
	{"openMenu": false, "openUser": true}</textarea
          >
        </p>
      </fieldset>
      <fieldset>
        <legend>Profile</legend>
        <p>
          <label for="profile[name]:string">NAME</label><br />
          <input name="profile[name]:string" value="MARCUS" />
        </p>
        <p>
          <input type="radio" name="profile[gender]" value="other" checked />
          Other
          <input type="radio" name="profile[gender]" value="male" /> Male<br />
          <input type="radio" name="profile[gender]" value="female" />
          Female<br />
        </p>
        <p>
          <label for="profile[phone]:str">PHONE</label><br />
          <input name="profile[phone]:str" value="12345-1234" />
        </p>
        <p>
          <label for="profile[age]:integer">AGE</label><br />
          <input name="profile[age]:integer" value="28" />
        </p>
        <p>
          <select multiple name="profile[colors][]">
            <option value="blue">Blue</option>
            <option value="red">Red</option>
            <option value="yellow">Yellow</option>
          </select>
        </p>
      </fieldset>
      <fieldset>
        <legend>Contact</legend>
        <p>
          <label for="profile[contact][][name]">NAME</label>
          <input name="profile[contact][][name]" value="Fulano da Silva" />
          <label for="profile[contact][][email]">EMAIL</label>
          <input name="profile[contact][][email]" value="fulano@email.com" />
          <label for="profile[contact][][phone]">PHONE</label>
          <input name="profile[contact][][phone]" value="12345-1234" />
          <button onclick="remove_contact(event);">-</button>
          <button onclick="append_contact(event);">+</button>
        </p>
      </fieldset>
      <br />
      <button type="submit">ENVIAR</button>
    </form>
```


### JAVASCRIPT:
Your **javascript** code look likes this:
```html
<script>
//handle submit, parse and print data at console
function handle_submit(event) {
  event.preventDefault();
  console.log(dataform.parse(event.target));
}

//btn add contact, array field sample
function append_contact(event) {
  event.preventDefault();

  var parent_p = dataform.find_closets(event.target, "p");
  var contact_container = dataform.find_closets(parent_p, "fieldset");
  contact_container.appendChild(parent_p.cloneNode(true));
}

//btn remove contact, array field sample
function remove_contact(event) {
  event.preventDefault();

  var parent_p = dataform.find_closets(event.target, "p");
  var contact_container = dataform.find_closets(parent_p, "fieldset");
  if (contact_container.childElementCount > 2) {
    contact_container.removeChild(parent_p);
  }
}

//submit listener
dataform.find_id("form").addEventListener("submit", handle_submit);
</script>
```

### RESULTS IN:
```javascript
var obj = {
  codigo: 1,
  profile: {
    age: 28
    colors: [
      "blue",
      "red",
    ],
    contact: [
      {
        email: "fulano@email.com",
        name: "Fulano da Silva",
        phone: "12345-1234"
      }
    ],
    gender: "other",
    name: "FULANO",
    phone: "12345-1234",
    roles: {
      admin: false,
      standard: false,
      guest: false
    },
  },
  tags: [
    "tag1",
    "tag2",
    "tag3",
    "tag4",
    "tag5",  
  ],
  options: {
    openMenu: false,
    openUser: true  
  }
}
```


#### Comma Split
And special type `comma_split`, to use with comma splited inputs:

Ex.: Tags fields separeted by comma.
```html
<input type="text" name="tags:comma_split" value="tag1,tag2,tag3,tag4,tag5"/>
```

Results in array
```javscript
var dataform = {
  tags: [
    "tag1",
    "tag2",
    "tag3",
    "tag4",
    "tag5",  
  ]
}
```

[BACK-HOME](https://github.com/maviniciuus/js-dataform/blob/master/README.md)
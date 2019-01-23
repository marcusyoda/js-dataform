function is_object(obj) {
  return obj === Object(obj);
}
function is_array(arr) {
  return Array.isArray(arr);
}
function is_undefined(val) {
  return val === void 0;
}
function is_valid_array_index(val) {
  return /^[0-9]+$/.test(String(val));
}
function is_numeric(numeric) {
  return !is_undefined(numeric) && numeric - parseFloat(numeric) >= 0;
}

/**
 * Find element by id
 * @param {string} id
 * @return {element}
 */
function find_id(id) {
  return document.getElementById(id);
}

/**
 * Find all elements with class name
 * @param {string} className
 * @return {element}
 */
function find_class(className) {
  return document.getElementsByClassName(className);
}

/**
 * Find first element by class name
 * @param {string} className
 * @return {element}
 */
function findOne_class(className) {
  var el = document.getElementsByClassName(className);
  return el && el[0];
}

/**
 * Find the closets DOM element
 * @param {element} elem
 * @param {string} selector
 */
function find_closets(elem, selector) {
  for (; elem && elem !== document; elem = elem.parentNode) {
    if (elem.matches(selector)) return elem;
  }
  return null;
}

/**
 * Get inputs by form element
 * @param {element} el_form
 * @return {HtmlCollection}
 */
function inputs_by_form(el_form) {
  var el = el_form.getElementsByTagName("input");
  return el ? el : [];
}

/**
 * Get textareas by form element
 * @param {element} el_form
 * @return {HtmlCollection}
 */
function textareas_by_form(el_form) {
  var el = el_form.getElementsByTagName("textarea");
  return el ? el : [];
}

/**
 * Get textareas by form element
 * @param {element} el_form
 * @return {HtmlCollection}
 */
function selects_by_form(el_form) {
  var el = el_form.getElementsByTagName("select");
  return el ? el : [];
}

var allowedTypes = {
  string: "string",
  integer: "integer",
  float: "float",
  boolean: "boolean",
  object: "object",
  comma_split: "comma_split"
};

function parse_type_alias(type) {
  switch (type) {
    case "str":
      return "string";
    case "int":
      return "integer";
    case "bool":
      return "boolean";
    case "obj":
      return "object";
    default:
      return type;
  }
}

/**
 * Extract type and name from name
 * @param {string} name
 * @return {object} parsed_name: name with no type, type: input data type
 */
function extract_type_and_name(name) {
  var match;
  if ((match = name.match(/(.*):([^:]+)$/))) {
    return { parsed_name: match[1], type: parse_type_alias(match[2]) };
  } else {
    return { parsed_name: name, type: null };
  }
}

/**
 * Parse value by type
 * @param {*} value
 * @param {string} type
 */
function extract_value_by_type(value, type) {
  switch (type) {
    case allowedTypes.string:
      return String(value);
    case allowedTypes.integer:
      return parseInt(value);
    case allowedTypes.float:
      return parseFloat(value);
    case allowedTypes.boolean:
      return !!value;
    case allowedTypes.object:
      return JSON.parse(value);
    case allowedTypes.comma_split:
      return value.split(",").map(val => val.trim());
    default:
      return value;
  }
}

function get_select_values(select) {
  var result = [];
  var options = select && select.options;
  var opt;

  for (var i = 0, iLen = options.length; i < iLen; i++) {
    opt = options[i];

    if (opt.selected) {
      result.push(opt.value || opt.text);
    }
  }
  return result;
}

/**
 * Return info about form inputs by HtmlCollection
 * @param {array} HtmlCollection
 */
function info_by_fields(HtmlCollection) {
  if (!HtmlCollection) return [];

  var info = [];
  for (var i = 0; i < HtmlCollection.length; i++) {
    if (HtmlCollection[i]) {
      //radio unchecked is not included
      if (HtmlCollection[i].type === "radio" && !HtmlCollection[i].checked)
        continue;

      //normal fields
      var input_info = extract_type_and_name(HtmlCollection[i].name);
      var field_value = extract_value_by_type(
        HtmlCollection[i].value,
        input_info.type
      );

      //multiple select need special parse
      if (HtmlCollection[i].type === "select-multiple") {
        field_value = get_select_values(HtmlCollection[i]);
      }

      //checkbox select need special parse
      if (HtmlCollection[i].type === "checkbox") {
        field_value = !!HtmlCollection[i].checked;
      }

      info[i] = {
        name: input_info.parsed_name,
        type: input_info.type,
        value: field_value
      };
    }
  }

  return info.filter(val => !!val);
}

/**
 * Load inputs and textareas by Form target
 * @param {element} target
 */
function get_form_info(target) {
  return [].concat(
    info_by_fields(inputs_by_form(target)),
    info_by_fields(textareas_by_form(target)),
    info_by_fields(selects_by_form(target))
  );
}

// Set a value in an object or array, using multiple keys to set in a nested object or array:
//
// deep_set(obj, ['foo'], v)               // obj['foo'] = v
// deep_set(obj, ['foo', 'inn'], v)        // obj['foo']['inn'] = v // Create the inner obj['foo'] object, if needed
// deep_set(obj, ['foo', 'inn', '123'], v) // obj['foo']['arr']['123'] = v //
//
// deep_set(obj, ['0'], v)                                   // obj['0'] = v
// deep_set(arr, ['0'], v, {useIntKeysAsArrayIndex: true})   // arr[0] = v
// deep_set(arr, [''], v)                                    // arr.push(v)
// deep_set(obj, ['arr', ''], v)                             // obj['arr'].push(v)
//
// arr = [];
// deep_set(arr, ['', v]          // arr => [v]
// deep_set(arr, ['', 'foo'], v)  // arr => [v, {foo: v}]
// deep_set(arr, ['', 'bar'], v)  // arr => [v, {foo: v, bar: v}]
// deep_set(arr, ['', 'bar'], v)  // arr => [v, {foo: v, bar: v}, {bar: v}]
//
function deep_set(o, keys, value, opts) {
  var key, nextKey, tail, lastIdx, lastVal, f;
  if (opts == null) {
    opts = {};
  }

  if (is_undefined(o)) {
    throw new Error(
      "ArgumentError: param 'o' expected to be an object or array, found undefined"
    );
  }

  if (!keys || keys.length === 0) {
    throw new Error(
      "ArgumentError: param 'keys' expected to be an array with least one element"
    );
  }

  key = keys[0];

  // Only one key, then it's not a deep_set, just assign the value.
  if (keys.length === 1) {
    if (key === "") {
      o.push(value); // '' is used to push values into the array (assume o is an array)
    } else {
      o[key] = value; // other keys can be used as object keys or array indexes
    }

    // With more keys is a deep_set. Apply recursively.
  } else {
    nextKey = keys[1];

    // '' is used to push values into the array,
    // with nextKey, set the value into the same object, in object[nextKey].
    // Covers the case of ['', 'foo'] and ['', 'var'] to push the object {foo, var}, and the case of nested arrays.
    if (key === "") {
      lastIdx = o.length - 1; // asume o is array
      lastVal = o[lastIdx];
      if (
        is_object(lastVal) &&
        (is_undefined(lastVal[nextKey]) || keys.length > 2)
      ) {
        // if nextKey is not present in the last object element, or there are more keys to deep set
        key = lastIdx; // then set the new value in the same object element
      } else {
        key = lastIdx + 1; // otherwise, point to set the next index in the array
      }
    }

    // '' is used to push values into the array "array[]"
    if (nextKey === "") {
      if (is_undefined(o[key]) || !is_array(o[key])) {
        o[key] = []; // define (or override) as array to push values
      }
    } else {
      if (opts.useIntKeysAsArrayIndex && is_valid_array_index(nextKey)) {
        // if 1, 2, 3 ... then use an array, where nextKey is the index
        if (is_undefined(o[key]) || !is_array(o[key])) {
          o[key] = []; // define (or override) as array, to insert values using int keys as array indexes
        }
      } else {
        // for anything else, use an object, where nextKey is going to be the attribute name
        if (is_undefined(o[key]) || !is_object(o[key])) {
          o[key] = {}; // define (or override) as object, to set nested properties
        }
      }
    }

    // Recursively set the inner object
    tail = keys.slice(1);
    deep_set(o[key], tail, value, opts);
  }
}

// Split the input name in programatically readable keys.
// Examples:
// "foo"              => ['foo']
// "[foo]"            => ['foo']
// "foo[inn][bar]"    => ['foo', 'inn', 'bar']
// "foo[inn[bar]]"    => ['foo', 'inn', 'bar']
// "foo[inn][arr][0]" => ['foo', 'inn', 'arr', '0']
// "arr[][val]"       => ['arr', '', 'val']
function split_input_name_into_keys_array(nameWithNoType) {
  var keys,
    auxKeys = [];
  keys = nameWithNoType.split("["); // split string into array

  for (i = 0; i < keys.length; i++) {
    auxKeys.push(keys[i].replace(/\]/g, ""));
  }

  if (auxKeys[0] === "") {
    auxKeys.shift();
  } // ensure no opening bracket ("[foo][inn]" should be same as "foo[inn]")

  return auxKeys;
}

function info_to_obj(form_info) {
  var auxObj = {};
  for (var i = 0; i < form_info.length; i++) {
    deep_set(
      auxObj,
      split_input_name_into_keys_array(form_info[i]["name"]),
      form_info[i]["value"]
    );
  }
  return auxObj;
}

function parse(target) {
  return info_to_obj(get_form_info(target));
}

module.exports.find_id = find_id;
module.exports.find_class = find_class;
module.exports.findOne_class = findOne_class;
module.exports.find_closets = find_closets;
module.exports.get_form_info = get_form_info;
module.exports.parse = parse;

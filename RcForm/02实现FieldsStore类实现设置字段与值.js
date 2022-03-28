const createForm = (options) => {
  return (Component) => {
    function Field() {}
    // 检查obj实例是否是Field的构造函数
    function isFormField(obj) {
      return obj instanceof Field;
    }
    // 创建字段
    function createFormField(field) {
      if (isFormField(field)) {
        return field;
      }
      return new Field(field);
    }

    class FieldsStore {
      // fields: {age: {…}, name: {…}, note.tree: {…}} //  提供个用户的字段
      // fieldsMeta: {normal: {…}, note.tree: {…}, age: {…}, name: {…}, address: {…}, …} //  rcForm 操作的字段
      // getAllValues: ƒ () // 获取所有值
      // getFieldError: ƒ (name) // 获取字段错误信息
      // getFieldValue: ƒ (name) // 获取字段值
      // getFieldsError: ƒ (names) // 获取所有字段错误信息
      // getFieldsValue: ƒ (names) // 获取所有字段值
      // isFieldTouched: ƒ (name)
      // isFieldValidating: ƒ (name)
      // isFieldsTouched: ƒ (ns)
      // isFieldsValidating: ƒ (ns)
      // setFieldsInitialValue: ƒ (initialValues) // 设置字段初始化值

      // Property
      // clearField: ƒ clearField(name)
      // constructor: ƒ FieldsStore(fields // 字段 )
      // flattenRegisteredFields: ƒ flattenRegisteredFields(fields)
      // getAllFieldsName: ƒ getAllFieldsName()
      // getField: ƒ getField(name)
      // getFieldMember: ƒ getFieldMember(name, member)
      // getFieldMeta: ƒ getFieldMeta(name)
      // getFieldValuePropValue: ƒ getFieldValuePropValue(fieldMeta)
      // getNestedAllFields: ƒ getNestedAllFields()
      // getNestedField: ƒ getNestedField(name, getter)
      // getNestedFields: ƒ getNestedFields(names, //字段名称 getter //自定义设置字段对象的函数 )
      // getNotCollectedFields: ƒ getNotCollectedFields()
      // getValidFieldsFullName: ƒ getValidFieldsFullName(maybePartialName)
      // getValidFieldsName: ƒ getValidFieldsName()
      // getValueFromFields: ƒ getValueFromFields(name, // 字段名称 fields // 所有的字段 )
      // isValidNestedFieldName: ƒ isValidNestedFieldName(name)
      // resetFields: ƒ resetFields(ns)
      // setFieldMeta: ƒ setFieldMeta(name, meta)
      // setFields: ƒ setFields(fields)
      // setFieldsAsDirty: ƒ setFieldsAsDirty()
      // updateFields: ƒ updateFields(fields)
      // babel 在线转换  https://www.babeljs.cn/repl
      constructor(fields) {
        this.fields = fields || {};
        this.fieldsMeta = {}; // rcForm存储表单字段初始化的值

        // name: "address"
        // originalProps: {type: "text"}
        // ref: null
        // rules: (2) [
        //         {
        //           message: "Please input your note!",
        //             required: true
        //         },
        //         {
        //           validator: (rule, value, callback) => {…}
        //         }
        // ]
        // trigger: "onChange"
        // validate: [
        //         {
        //           message: "Please input your note!",
        //             required: true
        //         },
        //         {
        //           validator: (rule, value, callback) => {…}
        //         }
        // ]
        // valuePropName: "value"

        // 以下写法会直接添加到对象的实例中
        this.getAllValues = () => {}; // 获取所有值
        this.getFieldError = () => {}; // 获取字段错误信息
        this.getFieldValue = () => {}; // 获取字段值
        this.getFieldsError = () => {}; // 获取所有字段错误信息
        this.getFieldsValue = () => {}; // 获取所有字段值
        this.isFieldTouched = () => {};
        this.isFieldValidating = () => {};
        this.isFieldsTouched = () => {};
        this.isFieldsValidating = () => {};
        this.setFieldsInitialValue = () => {}; // 设置字段初始化值
      }

      // 以下写法会直接添加到对象的实例中，这样写法是es7写法, 由于 cdn 不支持es7 所以只能写在实例中
      // getAllValues=()=> {} // 获取所有值
      // getFieldError=()=> {} // 获取字段错误信息
      // getFieldValue=()=> {} // 获取字段值
      // getFieldsError=()=> {} // 获取所有字段错误信息
      // getFieldsValue=()=>{} // 获取所有字段值
      // isFieldTouched=()=> {}
      // isFieldValidating=()=>{}
      // isFieldsTouched=()=>{}
      // isFieldsValidating=()=> {}
      // setFieldsInitialValue=()=> {} // 设置字段初始化值

      // 以下写法会添加到对象的 property  中
      clearField() {}
      flattenRegisteredFields() {}
      getAllFieldsName() {}
      getField(name) {
        return this.fields[name] || {};
      }
      getFieldMember() {}
      getFieldMeta(name) {
        this.fieldsMeta[name] = this.fieldsMeta[name] || {};
        return this.fieldsMeta[name];
      }
      getFieldValuePropValue(fieldMeta) {
        console.log('fieldMeta=',fieldMeta);

        //获取字段名称
        var name = fieldMeta.name,
          //获取ValueProps
          getValueProps = fieldMeta.getValueProps,
          valuePropName = fieldMeta.valuePropName; // 这里一般指的是value

        // 获取单个字段对象
        var field = this.getField(name);
        // 字段是否存在值，如果没有则给初始化值
        var fieldValue =
          "value" in field ? field.value : fieldMeta.initialValue;
        // 如果属性上面设置有值则返回值
        if (getValueProps) {
          return getValueProps(fieldValue);
        }
        return {
          [valuePropName]: fieldValue,
        };
      }
      getNestedAllFields() {}
      getNestedField() {}
      getNestedFields() {}
      getNotCollectedFields() {}
      getValidFieldsFullName() {}
      getValidFieldsName() {}
      getValueFromFields(
        name, // 字段名称
        fields // 所有的字段
      ) {
        var field = fields[name]; // 获取当前的字段
        if (field && "value" in field) {
          return field.value; //如果有值的返回出去
        }
        // 获取单个字段的getFieldMeta 对象 这个是字段 信息
        var fieldMeta = this.getFieldMeta(name);
        // 如果字段用没有值则取初始化值
        return fieldMeta && fieldMeta.initialValue;
      }
      isValidNestedFieldName() {}
      resetFields() {

        
      }
      setFieldMeta(name, meta) {
        this.fieldsMeta[name] = meta;
      }
      setFields(fields) {
        // 获取字段信息
        var fieldsMeta = this.fieldsMeta;
        var nowFields = {
          ...this.fields,
          ...fields,
        };
        // 新的值
        var nowValues = {};
        // 获取字段的值
        Object.keys(fieldsMeta).forEach(function (f) {
          // 获取字段的值
          nowValues[f] = this.getValueFromFields(
            f, // 字段名称
            nowFields // 所有字段
          );
        });

        // 循环现在的值 然后注册到Meta 中
        Object.keys(nowValues).forEach((f) => {
          // 获取单个值
          var value = nowValues[f];
          // 获取单个字段的getFieldMeta 对象 这个是字段 信息
          var fieldMeta = _this.getFieldMeta(f);
          // 初始化值设定的一个函数 demo https://codepen.io/afc163/pen/JJVXzG?editors=0010
          if (fieldMeta && fieldMeta.normalize) {
            // 获取字段的值
            //当前值
            var nowValue = fieldMeta.normalize(
              value,
              this.getValueFromFields(f, _this.fields),
              nowValues
            );
            //如果新的值和旧的值不相同则更新新的值
            if (nowValue !== value) {
              nowFields[f] =  {
                 ... nowFields[f], 
                 value: nowValue,
              } 
            }
          }
          // 设置 字段
          this.fields = nowFields;
        });
      }
      setFieldsAsDirty() {}
      updateFields() {}
    }

    return class Form extends React.Component {
      constructor(props) {
        super(props);
        this.fieldsStore = new FieldsStore();
      }
      getValueFromEvent(e) {
        console.log("e===========", e);
        console.log("e.target===========", e.target);
        // To support custom element
        if (!e || !e.target) {
          return e;
        }
        var target = e.target;

        return target.type === "checkbox" ? target.checked : target.value;
      }
     // 收集 事件中获取值 和从事件中设置值
      onCollectCommon(name, action, args) {
        // 获取单个字段的getFieldMeta 对象 这个是字段 信息 和设置 Meta 初始化值作用
        var fieldMeta = this.fieldsStore.getFieldMeta(name);
        // 判断fieldMeta 中有 事件么 如果有有则执行事件
        if (fieldMeta[action]) {
          // 执行方法
          fieldMeta[action].apply(
            fieldMeta,
            // 数组去重
            [...new Set(args)]
          );
        } else if (
          //原始组件的的props 属性
          fieldMeta.originalProps &&
          //原始组件的的props 属性 事件
          fieldMeta.originalProps[action]
        ) {
          var _fieldMeta$originalPr;

          (_fieldMeta$originalPr = fieldMeta.originalProps)[action].apply(
            _fieldMeta$originalPr,
            // 数组去重
            [...new Set(args)]
          );
        }

        //从事件中获取值
        var value = fieldMeta.getValueFromEvent
          ? fieldMeta.getValueFromEvent.apply(
              fieldMeta,
              // 数组去重
              [...new Set(args)]
            )
          : this.getValueFromEvent.apply(
              undefined,
              // 数组去重
              [...new Set(args)]
            );
        // 获取字段
        var field = this.fieldsStore.getField(name);
        return {
          // 字段名称
          name: name,
          // 合并新的字段
          field: {...field,   value: value, touched: true } ,
          // 字段存储对象
          fieldMeta: fieldMeta,
        };
      }
      onCollectValidate(name_, action) {
        console.log("arguments=", arguments);
        console.log("onCollectValidate===========");
        for (
          var _len2 = arguments.length,
            args = Array(_len2 > 2 ? _len2 - 2 : 0),
            _key2 = 2;
          _key2 < _len2;
          _key2++
        ) {
          // 收集大于2个参数组成数组存放在args数组中
          args[_key2 - 2] = arguments[_key2];
        }
      // 收集设置字段 从事件中获取值 和从事件中设置值
       var   onCollectCommon = this.onCollectCommon(name_, action, args)
       console.log('onCollectCommon=',onCollectCommon)


      }
      getForm() {
        return {
          getFieldsValue: () => {}, // 获取字段值得函数
          getFieldValue: () => {}, // 获取单个值得函数
          getFieldInstance: () => {}, // 获取字段实例
          setFieldsValue: () => {}, // 设置字段值
          setFields: () => {}, // 设置字段 新的值
          setFieldsInitialValue: () => {}, // 设置初始化值的函数
          getFieldDecorator: () => {}, // 用于和表单进行双向绑定，详见下方描述 装饰组件，促进双向绑定的修饰器
          getFieldProps: (name, usersFieldOption) => {
            //获取字段选项参数
            var fieldOption = {
              ...{
                name: name, // 字段名称
                trigger: "onChange", //onChange 收集子节点的值的时机
                valuePropName: "value", // 字段value
                validate: [], // 验证 空数组
              },
              ...usersFieldOption,
            };
            var fieldMeta = this.fieldsStore.getFieldMeta(name);

            console.log("this.fieldsStore==", this.fieldsStore);
            // 判断是否有初始化值
            if ("initialValue" in fieldOption) {
              // 如果有重新赋值
              fieldMeta.initialValue = fieldOption.initialValue;
            }
            // 获取字段的value 值
            var inputProps = this.fieldsStore.getFieldValuePropValue(
              fieldOption
            );

          
            inputProps[fieldOption.trigger] = this.onCollectValidate.bind(
              this,
              name,
              fieldOption.trigger
            );
            console.log("inputProps=", inputProps);
            return inputProps;
            // this.fieldsStore.cre;
          }, // 创建待验证的表单 设置字段元数据，返回 计算被修饰组件的属性
          getFieldsError: () => {}, //获取一组输入控件的 Error ，如不传入参数，则获取全部组件的 Error
          getFieldError: () => {}, //获取某个输入控件的 Error
          isFieldValidating: () => {}, //判断一个输入控件是否在校验状态
          isFieldsValidating: () => {}, // 判断字段是否在校验中
          isFieldsTouched: () => {}, //判断是否任一输入控件经历过 getFieldDecorator 的值收集时机 options.trigger
          isFieldTouched: () => {}, //判断一个输入控件是否经历过 getFieldDecorator 的值收集时机 options.trigger
          isSubmitting: () => {}, // 是否在 提交状态
          submit: () => {}, // 表单提交函数
          validateFields: () => {
            
          }, //验证字段,返回promise
          resetFields: () => {}, // 重置字段
        };
      }

      render() {
        const props = {
          form: this.getForm.call(this),
        };
        return <Component {...props} />;
      }
    };
  };
};

class BaseForm extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    console.log(this.props);
    // debugger;
  }
  submit = (e) => {
    // this.props.form.resetFields(["note"]);
    // console.log("this.props.form=", this.props.form);

    // this.props.form.setFields({
    //   "note.tree": {
    //     value: 123,
    //     // errors: [new Error("forbid ha")],
    //   },
    // });

    // setTimeout(() => {
    this.props.form.validateFields((error, value) => {
      console.log(error, value);
      debugger;
    });
    e.preventDefault();
    e.stopPropagation();
    e.cancelBubble = true;
    return false;
    // }, 100);
  };
  render() {
    const { form: { getFieldProps } = {} } = this.props;
    return (
      <form>
        <input {...getFieldProps("name")} />
        <select>
          <option>1</option>
          <option>2</option>
        </select>
        <button onClick={this.submit.bind(this)}>
           提交
        </button>
      </form>
    );
  }
}

const Form = createForm({ name: "abc" })(BaseForm);

ReactDOM.render(<Form />, document.getElementById("example"));

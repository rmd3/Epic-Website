var InsertSLOBox = React.createClass({
    handleInsertSLOSubmit: function (slo) {

        $.ajax({
            url: '/slo',
            dataType: 'json',
            type: 'POST',
            data: slo,
            success: function (data) {
                this.setState ({ data: data});
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    },
    render: function () {
        return (
            <div className="InsertSLOBox">
                <h3>Welcome, Student Test</h3>
                <h2>Insert SLO</h2>
                <InsertSLOForm2 onInsertSLOSubmit={this.handleInsertSLOSubmit} />
                <br />
                
            </div>
        );
    }
});

var InsertSLOForm2 = React.createClass({
    getInitialState: function () {
        return {
            coursename: [],
            courseslo: [],
            sloindicator: [],
            slothree: "",
            slotwo: "",
            sloone: ""

        };
    },
    handleOptionChange: function (e) {
        this.setState({
            selectedOption: e.target.value
        });
    },
    loadCourname: function () {
        $.ajax({
            url: '/getcourname',
            dataType: 'json',
            cache: false,
            success: function (data) {
                this.setState({ coursename: data});
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    },
    componentDidMount: function () {
        this.loadCourname();
    },
    handleSubmit: function (e) {
        e.preventDefault();

        var coursename = courname.value;
        var courseslo = courslo.value;
        var sloindicator = sloindic.value;
        var slothree = this.state.slothree.trim();
        var slotwo = this.state.slotwo.trim();
        var sloone = this.state.sloone.trim();

        if (isNaN(slothree) || isNaN(slotwo) || isNaN(sloone)) {
            console.log("Not a number " + slotwo);
            return;
        }
        if (!coursename || !courseslo || !sloone || !slotwo || !sloindicator || !slothree) {
            console.log("Field Missing");
            return;
        }

        this.props.onInsertSLOSubmit({
            coursename: coursename,
            courseslo: courseslo,
            sloindicator: sloindicator,
            slothree: slothree,
            slotwo: slotwo,
            sloone: sloone
        });

    },
    commonValidate: function () {
        return true;
    },
    setValue: function (field, event) {
        var object = {};
        object[field] = event.target.value;
        this.setState(object);
    },
    render: function () {
        return (
            <div>
                <div id="theform">
                    <form onSubmit={this.handleSubmit}>
                        <table>
                            <tbody>
                                <tr>
                                    <th>Course:</th>
                                    <td>
                                        <SelectList data={this.state.coursename} />
                                    </td>
                                </tr>
				                <tr>
                                    <th>Select SLO:</th>
                                    <td>
                                        <select id="courslo">
                                            <option value="SLO 1">SLO 1</option>,
                                            <option value="SLO 2">SLO 2</option>,
                                            <option value="SLO 3">SLO 3</option>
                                        </select>
                                    </td>
                                </tr>
				                <tr>
                                    <th>Select Indicator:</th>
                                    <td>
                                        <select id="sloindic">
                                            <option value="1">1</option>,
                                            <option value="2">2</option>,
                                            <option value="3">3</option>,
                                            <option value="4">4</option>
                                        </select>
                                    </td>
                                </tr>
                                <tr>
                                    <th>Enter SLO Three:</th>
                                    <td>
                        <TextInput
                            value={this.state.slothree}
                            uniqueName="slothree"
                            textArea={false}
                            required={true}
                            minCharacters={1}
                            validate={this.commonValidate}
                            onChange={this.setValue.bind(this, 'slothree')}
                            errorMessage="SLO Three is invalid"
                            emptyMessage="SLO Three is required" />
                                    </td>
                                </tr>
                                <tr>
                                    <th>Enter SLO Two:</th>
                                    <td>
                        <TextInput
                            value={this.state.slotwo}
                            uniqueName="slotwo"
                            textArea={false}
                            required={true}
                            minCharacters={1}
                            validate={this.commonValidate}
                            onChange={this.setValue.bind(this, 'slotwo')}
                            errorMessage="SLO Two is invalid"
                            emptyMessage="SLO Two is required" />
                                    </td>
                                </tr>
                                <tr>
                                    <th>Enter the SLO One:</th>
                                    <td>
                        <TextInput
                            value={this.state.sloone}
                            uniqueName="sloone"
                            textArea={false}
                            required={true}
                            minCharacters={1}
                            validate={this.commonValidate}
                            onChange={this.setValue.bind(this, 'sloone')}
                            errorMessage="SLO One is invalid"
                            emptyMessage="SLO One is required" />
                                    </td>
                                </tr>
                            </tbody>
                        </table><br />
                        <input type="submit" value="Enter" />
                    </form>
                </div>
            </div>
        );
    }
});

var SelectList = React.createClass({
    render: function () {
        var optionNodes = this.props.data.map(function (courname) {
            return (
                <option
                    key={courname.courseid}
                    value={courname.courseid}
                >
                    {courname.courseprefix} {courname.coursenumber} {courname.coursesection} {courname.coursesemester} {courname.courseyear}
                </option>
            );
        });
        return (
            <select name="courname" id="courname">
                {optionNodes}
            </select>
        );
    }
});

var InputError = React.createClass({
    getInitialState: function () {
        return {
            message: 'Input is invalid'
        };
    },
    render: function () {
        var errorClass = classNames(this.props.className, {
            'error_container': true,
            'visible': this.props.visible,
            'invisible': !this.props.visible
        });

        return (
                <td> {this.props.errorMessage} </td>
        )
    }
});

var TextInput = React.createClass({
    getInitialState: function () {
        return {
            isEmpty: true,
            value: null,
            valid: false,
            errorMessage: "",
            errorVisible: false
        };
    },

    handleChange: function (event) {
        this.validation(event.target.value);

        if (this.props.onChange) {
            this.props.onChange(event);
        }
    },

    validation: function (value, valid) {
        if (typeof valid === 'undefined') {
            valid = true;
        }

        var message = "";
        var errorVisible = false;

        if (!valid) {
            message = this.props.errorMessage;
            valid = false;
            errorVisible = true;
        }
        else if (this.props.required && jQuery.isEmptyObject(value)) {
            message = this.props.emptyMessage;
            valid = false;
            errorVisible = true;
        }
        else if (value.length < this.props.minCharacters) {
            message = this.props.errorMessage;
            valid = false;
            errorVisible = true;
        }

        this.setState({
            value: value,
            isEmpty: jQuery.isEmptyObject(value),
            valid: valid,
            errorMessage: message,
            errorVisible: errorVisible
        });

    },

    handleBlur: function (event) {
        var valid = this.props.validate(event.target.value);
        this.validation(event.target.value, valid);
    },
    render: function () {
        if (this.props.textArea) {
            return (
                <div className={this.props.uniqueName}>
                    <textarea
                        placeholder={this.props.text}
                        className={'input input-' + this.props.uniqueName}
                        onChange={this.handleChange}
                        onBlur={this.handleBlur}
                        value={this.props.value} />

                    <InputError
                        visible={this.state.errorVisible}
                        errorMessage={this.state.errorMessage} />
                </div>
            );
        } else {
            return (
                <div className={this.props.uniqueName}>
                    <input
                        name={this.props.uniqueName}
                        id={this.props.uniqueName}
                        placeholder={this.props.text}
                        className={'input input-' + this.props.uniqueName}
                        onChange={this.handleChange}
                        onBlur={this.handleBlur}
                        value={this.props.value} />

                    <InputError
                        visible={this.state.errorVisible}
                        errorMessage={this.state.errorMessage} />
                </div>
            );
        }
    }
});

ReactDOM.render(
    <InsertSLOBox />,
    document.getElementById('content')
);


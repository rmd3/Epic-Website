var InsertCourseBox = React.createClass({
    handleInsertCourseSubmit: function (course) {

        $.ajax({
            url: '/course',
            dataType: 'json',
            type: 'POST',
            data: course,
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
            <div className="InsertCourseBox">
                <h3>Welcome, Student Test</h3>
                <h2>Insert Course</h2>
                <InsertCourseForm2 onInsertCourseSubmit={this.handleInsertCourseSubmit} />
                <br />
                
            </div>
        );
    }
});

var InsertCourseForm2 = React.createClass({
    getInitialState: function () {
        return {
            facultyname: [],
            coursesemester: [],
            courseyear: [],
            courseprefix: "",
            coursenumber: "",
            coursesection: ""

        };
    },
    handleOptionChange: function (e) {
        this.setState({
            selectedOption: e.target.value
        });
    },
    loadFacName: function () {
        $.ajax({
            url: '/getfacname',
            dataType: 'json',
            cache: false,
            success: function (data) {
                this.setState({ facultyname: data});
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    },
    componentDidMount: function () {
        this.loadFacName();
    },
    handleSubmit: function (e) {
        e.preventDefault();

        var facultyname = facname.value;
        var coursesemester = coursem.value;
        var courseyear = couryear.value;
        var courseprefix = this.state.courseprefix.trim();
        var coursenumber = this.state.coursenumber.trim();
        var coursesection = this.state.coursesection.trim();

        if (isNaN(coursenumber)) {
            console.log("Not a number " + coursenumber);
            return;
        }
        if (!facultyname || !coursesemester || !coursesection || !coursenumber || !courseyear || !courseprefix) {
            console.log("Field Missing");
            return;
        }

        this.props.onInsertCourseSubmit({
            facultyname: facultyname,
            coursesemester: coursesemester,
            courseyear: courseyear,
            courseprefix: courseprefix,
            coursenumber: coursenumber,
            coursesection: coursesection
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
                                    <th>Faculty:</th>
                                    <td>
                                        <SelectList data={this.state.facultyname} />
                                    </td>
                                </tr>
				                <tr>
                                    <th>Select a Semester:</th>
                                    <td>
                                        <select id="coursem">
                                            <option value="Fall">Fall</option>,
                                            <option value="Spring">Spring</option>,
                                            <option value="Summer">Summer</option>
                                        </select>
                                    </td>
                                </tr>
				                <tr>
                                    <th>Select a Year:</th>
                                    <td>
                                        <select id="couryear">
                                            <option value="2019">2019</option>,
                                            <option value="2020">2020</option>,
                                            <option value="2021">2021</option>,
                                            <option value="2022">2022</option>
                                        </select>
                                    </td>
                                </tr>
                                <tr>
                                    <th>Enter the Course Prefix:</th>
                                    <td>
                        <TextInput
                            value={this.state.courseprefix}
                            uniqueName="courseprefix"
                            textArea={false}
                            required={true}
                            minCharacters={3}
                            validate={this.commonValidate}
                            onChange={this.setValue.bind(this, 'courseprefix')}
                            errorMessage="Course Prefix is invalid"
                            emptyMessage="Course Prefix is required" />
                                    </td>
                                </tr>
                                <tr>
                                    <th>Enter the Course Number:</th>
                                    <td>
                        <TextInput
                            value={this.state.coursenumber}
                            uniqueName="coursenumber"
                            textArea={false}
                            required={true}
                            minCharacters={3}
                            validate={this.commonValidate}
                            onChange={this.setValue.bind(this, 'coursenumber')}
                            errorMessage="Course Number is invalid"
                            emptyMessage="Course Number is required" />
                                    </td>
                                </tr>
                                <tr>
                                    <th>Enter the Course Section:</th>
                                    <td>
                        <TextInput
                            value={this.state.coursesection}
                            uniqueName="coursesection"
                            textArea={false}
                            required={true}
                            minCharacters={3}
                            validate={this.commonValidate}
                            onChange={this.setValue.bind(this, 'coursesection')}
                            errorMessage="Course Section is invalid"
                            emptyMessage="Course Section is required" />
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
        var optionNodes = this.props.data.map(function (facName) {
            return (
                <option
                    key={facName.userid}
                    value={facName.userid}
                >
                    {facName.username}
                </option>
            );
        });
        return (
            <select name="facname" id="facname">
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
    <InsertCourseBox />,
    document.getElementById('content')
);


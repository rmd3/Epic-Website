var EmailBox = React.createClass({
    getInitialState: function () {
        return {
            data: []
        };
    },
    loadEmailsFromServer: function () {

        $.ajax({
            url: '/email/',
            data: {
                'courseprefix': courseprefix.value,
                'coursenumber': coursenumber.value,
                'coursesection': coursesection.value,
                'coursesemester': coursem.value,
                'courseyear': couryear.value,
                'facultyname': facultyname.value,
            },
            dataType: 'json',
            cache: false,
            success: function (data) {
                this.setState({ data: data });
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    },

    componentDidMount: function () {
        this.loadEmailsFromServer();
    },

    render: function () {
        return (
            <div>
                <h3>Welcome, Student Test</h3>
                <h2>Email Courses</h2>
                <EmailForm onEmailSubmit={this.loadEmailsFromServer} />
                <br />
                <table>
                    <thead>
                        <tr>
                            <th>Prefix</th>
                            <th>Number</th>
                            <th>Section</th>
                            <th>Semester</th>
                            <th>Year</th>
                            <th>Faculty</th>
                            <th>Email</th>
                        </tr>
                    </thead>
                <EmailList data={this.state.data} />
                </table>
            </div>
        );
    }
});

var EmailForm = React.createClass({
    getInitialState: function () {
        return {
            facultyname: "",
            coursesemester: [],
            courseyear: [],
            courseprefix: "",
            coursenumber: "",
            coursesection: "",
        };
    },
    handleOptionChange: function (e) {
        this.setState({
            selectedOption: e.target.value
        });
    },
    handleSubmit: function (e) {
        e.preventDefault();

        var facultyname = this.state.facultyname.trim();
        var coursesemester = coursem.value;
        var courseyear = couryear.value;
        var courseprefix = this.state.courseprefix.trim();
        var coursenumber = this.state.coursenumber.trim();
        var coursesection = this.state.coursesection.trim();
      
        this.props.onEmailSubmit({
            facultyname: facultyname,
            coursesemester: coursesemester,
            courseyear: courseyear,
            courseprefix: courseprefix,
            coursenumber: coursenumber,
            coursesection: coursesection
        });

    },
    handleChange: function (event) {
        this.setState({
            [event.target.id]: event.target.value
        });
    },
    render: function () {
        //Make Faculty textbox
        return (
            <div>
                <div id="theform">
                    <form onSubmit={this.handleSubmit}>

                        <table>
                            <tbody>
                                <tr>
                                    <th>Faculty:</th>
                                    <td>
                                        <input 
                                        type="text"
                                        name="facultyname" 
                                        id="facultyname" 
                                        value={this.state.facultyname} 
                                        onChange={this.handleChange} 
                                        />
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
                                    <th>Enter the Course Prefix (Ex: CPT, ENG, SOC):</th>
                                    <td>
                                        <input 
                                        type="text"
                                        name="courseprefix" 
                                        id="courseprefix" 
                                        value={this.state.courseprefix} 
                                        onChange={this.handleChange} 
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <th>Enter the Course Number (Ex: 101, 205, 121):</th>
                                    <td>
                                        <input 
                                        type="text"
                                        name="coursenumber" 
                                        id="coursenumber" 
                                        value={this.state.coursenumber} 
                                        onChange={this.handleChange} 
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <th>Enter the Section (Ex: H01, C02, G04, S06, I01):</th>
                                    <td>
                                        <input 
                                        type="text"
                                        name="coursesection" 
                                        id="coursesection" 
                                        value={this.state.coursesection} 
                                        onChange={this.handleChange} 
                                        />
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

var EmailList = React.createClass({
    render: function () {
        var emailNodes = this.props.data.map(function (email) {
            return (
                <Email
                    courprefix={email.courseprefix}
                    cournumber={email.coursenumber}
                    coursection={email.coursesection}
                    coursem={email.coursesemester}
                    couryear={email.courseyear}
                    facname={email.username}
                    facemail={email.useremail}
                >
                </Email>
            );
                       
        });
        
        //print all the nodes in the list
        return (
             <tbody>
                {emailNodes}
            </tbody>
        );
    }
});



var Email = React.createClass({

    render: function () {

        return (

            <tr>
                            <td>
                                {this.props.courprefix} 
                            </td>
                            <td>
                                {this.props.cournumber}
                            </td>
                            <td>
                                {this.props.coursection}
                            </td>
                            <td>
                                {this.props.coursem}
                            </td>
                            <td>
                                {this.props.couryear}
                            </td>
                            <td>
                                {this.props.facname}
                            </td>
                            <td>
                                {this.props.facemail}
                            </td>
                </tr>
        );
    }
});

ReactDOM.render(
    <EmailBox />,
    document.getElementById('content')
);


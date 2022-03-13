var SearchBox = React.createClass({
    getInitialState: function () {
        return {
            data: []
        };
    },
    loadSearchsFromServer: function () {
        var ccompletevalue = 2;
        if (courcompleteyes.checked) {
            ccompletevalue = 1;
        }
        if (courcompleteno.checked) {
            ccompletevalue = 0;
        }
        $.ajax({
            url: '/search/',
            data: {
                'courseprefix': courseprefix.value,
                'coursenumber': coursenumber.value,
                'coursesection': coursesection.value,
                'coursesemester': coursem.value,
                'courseyear': couryear.value,
                'facultyname': facultyname.value,
                'coursecompleted': ccompletevalue
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
        this.loadSearchsFromServer();
    },

    render: function () {
        return (
            <div>
                <h3>Welcome, Student Test</h3>
                <h2>Search Courses</h2>
                <SearchForm onSearchSubmit={this.loadSearchsFromServer} />
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
                            <th>Completed</th>
                        </tr>
                    </thead>
                <SearchList data={this.state.data} />
                </table>
            </div>
        );
    }
});

var SearchForm = React.createClass({
    getInitialState: function () {
        return {
            data: [],
            coursesemester: [],
            courseyear: [],
            courseprefix: "",
            coursenumber: "",
            coursesection: "",
            courseCompleted: ""
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
        var coursecompleted = this.state.selectedOption;
      
        this.props.onSearchSubmit({
            facultyname: facultyname,
            coursesemester: coursesemester,
            courseyear: courseyear,
            courseprefix: courseprefix,
            coursenumber: coursenumber,
            coursesection: coursesection,
            coursecompleted: coursecompleted
        });

    },
    handleChange: function (event) {
        this.setState({
            [event.target.id]: event.target.value
        });
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
                                <tr>
                            <th>Course Completed?</th>
                            <td>
                                <input 
                                type="radio"
                                name="courcompleted"
                                id="courcompleteyes" 
                                value="1" 
                                checked={this.state.selectedOption === "1"}
                                onChange={this.handleOptionChange}
                                className="form-check-input"
                                />Yes
                                <input 
                                type="radio"
                                name="courcompleted"
                                id="courcompleteno" 
                                value="0" 
                                checked={this.state.selectedOption === "0"}
                                onChange={this.handleOptionChange}
                                className="form-check-input"
                                />No
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

var SearchList = React.createClass({
    render: function () {
        var searchNodes = this.props.data.map(function (search) {
            //map the data to individual donations
            return (
                <Search
                    courprefix={search.courseprefix}
                    cournumber={search.coursenumber}
                    coursection={search.coursesection}
                    coursem={search.coursesemester}
                    couryear={search.courseyear}
                    facname={search.username}
                    courcompleted={search.coursecompleted}
                >
                </Search>
            );
                       
        });
        
        //print all the nodes in the list
        return (
             <tbody>
                {searchNodes}
            </tbody>
        );
    }
});



var Search = React.createClass({

    render: function () {
        if (this.props.courcompleted == 1) {
            var complete = "YES";
        } else {
            var complete = "NO";
        }
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
                                {complete}
                            </td>
                </tr>
        );
    }
});

ReactDOM.render(
    <SearchBox />,
    document.getElementById('content')
);
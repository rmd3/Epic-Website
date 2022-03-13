var ViewBox = React.createClass({
    getInitialState: function () {
        return {
            data: []
        };
    },
    loadViewsFromServer: function () {

        $.ajax({
            url: '/view/',
            data: {
                'courseprefix': courseprefix.value,
                'coursenumber': coursenumber.value,
                'coursesection': coursesection.value,
                'coursesemester': coursem.value,
                'courseyear': couryear.value
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
        this.loadViewsFromServer();
    },

    render: function () {
        return (
            <div>
                <h3>Welcome, Student Test</h3>
                <h2>View Courses</h2>
                <ViewForm onViewSubmit={this.loadViewsFromServer} />
                <br />
                <table>
                    <thead>
                        <tr>
                            <th>Prefix</th>
                            <th>Number</th>
                            <th>Section</th>
                            <th>Semester</th>
                            <th>Year</th>
                            <th>SLO</th>
                            <th>Indicator</th>
                            <th>Three</th>
                            <th>Two</th>
                            <th>One</th>
                        </tr>
                    </thead>
                <ViewList data={this.state.data} />
                </table>
            </div>
        );
    }
});

var ViewForm = React.createClass({
    getInitialState: function () {
        return {
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

        var coursesemester = coursem.value;
        var courseyear = couryear.value;
        var courseprefix = this.state.courseprefix.trim();
        var coursenumber = this.state.coursenumber.trim();
        var coursesection = this.state.coursesection.trim();
      
        this.props.onViewSubmit({
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
        return (
            <div>
                <div id="theform">
                    <form onSubmit={this.handleSubmit}>

                        <table>
                            <tbody>
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

var ViewList = React.createClass({
    render: function () {
        var viewNodes = this.props.data.map(function (view) {
            return (
                <View
                    courprefix={view.courseprefix}
                    cournumber={view.coursenumber}
                    coursection={view.coursesection}
                    coursem={view.coursesemester}
                    couryear={view.courseyear}
                    courslo={view.resultslo}
                    sloindic={view.resultindicator}
                    slothree={view.resultthree}
                    slotwo={view.resulttwo}
                    sloone={view.resultone}
                >
                </View>
            );
                       
        });
        
        //print all the nodes in the list
        return (
             <tbody>
                {viewNodes}
            </tbody>
        );
    }
});



var View = React.createClass({

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
                                {this.props.courslo}
                            </td>
                            <td>
                                {this.props.sloindic}
                            </td>
                            <td>
                                {this.props.slothree}
                            </td>
                            <td>
                                {this.props.slotwo}
                            </td>
                            <td>
                                {this.props.sloone}
                            </td>
                </tr>
        );
    }
});

ReactDOM.render(
    <ViewBox />,
    document.getElementById('content')
);
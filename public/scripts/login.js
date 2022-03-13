var LoginBox = React.createClass({
    getInitialState: function () {
        return {
            data: []
        };
    },
    handleLogin: function (logininfo) {

        $.ajax({
            url: '/login/',
            dataType: 'json',
            type: 'POST',
            data: logininfo,
            success: function (data) {
                this.setState({ data: data });
                if (typeof data.redirect == 'string') {
                    window.location = data.redirect;
                }
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    },

    render: function () {
        return (
            <div>
                <h2>Login Confirmation</h2>
                <p>You are not logged in.  Please log in</p>
                <LoginForm onLoginSubmit={this.handleLogin} />
                <br />
                
            </div>
        );
    }
});

var LoginForm = React.createClass({
    getInitialState: function () {
        return {
            facultyemail: "",
            facultypw: "",

        };
    },
    handleOptionChange: function (e) {
        this.setState({
            selectedOption: e.target.value
        });
    },
   
    handleSubmit: function (e) {
        e.preventDefault();

        var facultypw = this.state.facultypw.trim();
        var facultyemail = this.state.facultyemail.trim();
      
        this.props.onLoginSubmit({
            facultypw: facultypw,
            facultyemail: facultyemail
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
                                    <th>E-mail</th>
                                    <td>
                                        <input name="facultyemail" id="facultyemail" value={this.state.facultyemail} onChange={this.handleChange} />
                                    </td>
                                </tr>
                                <tr>
                                    <th>Password</th>
                                    <td>
                                        <input type = "password" name="facultypw" id="facultypw" value={this.state.facultypw} onChange={this.handleChange} />
                                    </td>
                                </tr>
                               
                            </tbody>
                        </table><br />
                        <input type="submit" value="Enter Login" />
                    </form>
                </div>
            </div>
        );
    }
});

ReactDOM.render(
    <LoginBox />,
    document.getElementById('content')
);


var app;

(function (app) {
  var localStorageOps = function(name){
    var localStorage = JSON.parse(window.localStorage.getItem(name));

    if(!localStorage){
      localStorage = {};
    }

    this.getAll = function() {
      return localStorage;
    }

    this.get = function (key) {
      var data = localStorage[key]
      return data;
    };

    this.delete = function (key){
      if(localStorage.key){
        localStorage.key = undefined;
      }
    };

    this.set = function (key, value) {
      localStorage[key] = value;
      var data = JSON.stringify(localStorage);
      window.localStorage.setItem(name, data);
      return localStorage;
    };
  };
  app.LC_Ops = new localStorageOps("vamsi");

})(app || (app = {}));

(function(app){
  var SearchBox = React.createClass({
    render:function(params) {
      return (
        <div>
        <input type="text" onChange = {this.props.handleChange} value = {this.props.searchText}/>
        <button onClick = {this.props.addTask}> Add Task</button>
        </div>
      )
    }
  });

  var ResultSet = React.createClass({
    getInitialState:function(){
      return {tasks:this.props.taskList}
    },
    // componentDidMount: function(){
    //   this.setState({tasks: app.LC_Ops.getAll()})
    // },
    render:function(){
      var self = this;
      var rows = Object.keys(this.state.tasks).map(function(task){
        return self.state.tasks[task].deleted ? "" : (<TableRow task = {self.state.tasks[task]}/>);
      });
      return(
        <table>
        <tbody>
        {rows}
        </tbody>
        </table>
      );
    }
  });


  var TableRow = React.createClass({
    getInitialState:function(){
      return {task: this.props.task}
    },
    handleDone:function(e){
      var task = this.state.task;
      task.completed = true;
      app.LC_Ops.set(task.name, task);
      this.status = 'isCompleted';
      this.setState({task: task});
    },
    handleDelete:function(){

    },
    render:function(){
      return(
        <tr>
          <td className = {this.state.task.completed? 'isCompleted': ''}> {this.props.task.name}</td>
          <td><button className = {this.state.task.completed? 'hide' : ''} onClick={this.handleDone}>done</button></td>
          <td><button onClick ={ this.handleDelete}>delete</button></td>
        </tr>
      )
    }
  });

  var ParentComponent = React.createClass({
    getInitialState:function(){
      return {searchText: '', tasks: app.LC_Ops.getAll()};
    },
    handleChange:function(e) {
      this.setState({searchText: e.target.value});
    },
    addTask:function (e) {
      if(this.state.searchText.length<1)
      return;
      var taskObj = {name:this.state.searchText, completed: false, deleted: false}
      var tasks = app.LC_Ops.set(taskObj.name, taskObj);
      this.setState({tasks: tasks, searchText:''});
    },
    render:function(){
      return (
        <div>
        <SearchBox searchText = {this.state.searchText} handleChange = {this.handleChange} addTask = {this.addTask} />
        <ResultSet taskList = {this.state.tasks} />
        </div>
      );
    }
  });

  ReactDOM.render(<ParentComponent/>, document.getElementById('content'));

})(app || (app = {}));

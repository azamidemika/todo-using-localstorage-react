const Student = props => {
  const [isChecked, setChecked] = useState(props.checked);
  const [thisStudent, setThisStudent] = useState(props.student);
  const [studentKey, setStudentKey] = useState(props.Key);
  const [willEdit, setWillEdit] = useState(false);

  let check = () => {
    setChecked(!isChecked);
    setWillEdit(false);
    var ae = JSON.parse(localStorage["data"]);
    ae[studentKey].checked = !isChecked;
    localStorage["data"] = JSON.stringify(ae);
  };

  let deleteByIndex = index => {
    var ae = JSON.parse(localStorage["data"]);
    var wd = confirm("¿Quieres borrar esto?");
    if (wd) {
      ae.splice(index, 1);
      localStorage["data"] = JSON.stringify(ae);
      window.location.reload();
      ae.map((o, i) => {
        o.key = i;
      });
    }
  };
  let updateByIndex = e => {
    var ae = JSON.parse(localStorage["data"]);
    setThisStudent(e.target.value);
    ae[studentKey].student = thisStudent + "";
    localStorage["data"] = JSON.stringify(ae);
  };
  return (
    <li
      class={`list-group-item ${
        isChecked ? " animated fadeIn" : "enabled animated fadeIn"
      }`}
    >
      <input
        type="checkbox"
        checked={isChecked}
        class="form-check-inline"
        onChange={() => check()}
      />{" "}
      <span class={isChecked ? "is-checked" : ""}>
        {!willEdit ? (
          <span onClick={() => setWillEdit(!isChecked)}>{thisStudent}</span>
        ) : (
          <input
            type="text"
            value={thisStudent}
            class="edit-input form-control"
            onChange={updateByIndex}
          />
        )}
        <div class="actions" style={{ float: "right" }}>
          {willEdit && (
            <button class="btn btn-info" onClick={() => setWillEdit(false)}>
              <span class="fa fa-save" />
            </button>
          )}
          <button
            class="btn btn-danger"
            onClick={() => deleteByIndex(studentKey)}
          >
            <span class="fa fa-times-circle" />
          </button>
        </div>
        {isChecked && (
          <span
            class="fa fa-check check-1 animated bounce"
            style={{ float: "right" }}
          />
        )}
      </span>
    </li>
  );
};

function App(props) {
  if (typeof localStorage["data"] === "undefined") {
    localStorage["data"] = JSON.stringify([]);
  }
  const [students, setStudents] = useState(JSON.parse(localStorage["data"]));
  const [newStudent, setNewStudent] = useState("");
  const [updated, setUpdated] = useState(0);
  let update = e => {
    setNewStudent(e.target.value);
    setUpdated(updated + 1);
  };
  let removeStudent = e => {
    var ae = JSON.parse(localStorage["data"]);
    ae.map((a, i) => {
      var st = ae[i];
      if (typeof st === "undefined") {
        console.log("Ocurrió un error");
      }
      if (st.checked) {
        ae.splice(i, 1);
        ae.map((o, i) => {
          o.key = i;
        });
      }
    });
    localStorage["data"] = JSON.stringify(ae);
    setStudents([]);
    setTimeout(() => {
      setStudents(JSON.parse(localStorage["data"]));
    }, 300);
  };
  return (
    <div>
      <div class="col-sm" />
      <div class="container col-sm-3">
        <br />
        <h4>Lista de tareas pendientes</h4>
        <div>
          <div class="form-group">
            <input
              autoFocus
              type="text"
              class="form-control"
              value={newStudent}
              onChange={update}
              placeholder="Tarea"
            />
            <div class="add-control">
              <button
                class="btn btn-success"
                onClick={() => {
                  if (newStudent.match(/[a-z]/i) || newStudent.match(/[0-9]/)) {
                    var a = JSON.parse(localStorage["data"]);
                    a.push({
                      student: newStudent,
                      checked: false,
                      key: a.length
                    });
                    setStudents(a);
                    localStorage["data"] = JSON.stringify(a);
                    setNewStudent("");
                    setUpdated(0);
                  } else {
                    null;
                  }
                }}
              >
                <span class="fa fa-plus-circle" />
              </button>
              <button class="btn btn-danger" onClick={() => removeStudent()}>
                <span class="fa fa-times-circle" />
              </button>
            </div>
          </div>
        </div>
        {updated > 0 &&
        (!newStudent.match(/[a-z]/i) && !newStudent.match(/[0-9]/)) ? (
          <p style={{ color: "red" }}>Este campo no puede estar vacio</p>
        ) : (
          ""
        )}

        <br />
        <p class="lead" style={{ color: "blue" }}>
          Presiona sobre el texto de una tarea para editarla (procura agregar un
          espacio al final).
        </p>
        <p class="lead animated fadeIn" style={{ textDecoration: "underline" }}>
          Total: {students.length}
        </p>

        <ul class="list-group">
          {students.map(student => (
            <Student
              student={student.student}
              checked={student.checked}
              Key={student.key}
            />
          ))}
        </ul>
      </div>
      <div class="col-sm" />
    </div>
  );
}

ReactDOM.render(<App />, document.querySelector("#app"));

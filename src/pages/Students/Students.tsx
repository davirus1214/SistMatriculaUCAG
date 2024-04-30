import { SetStateAction, useEffect, useState } from "react";
import DataTableBase from "../../components/dataTable/DataTableBase";
import { FaAddressCard, FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { RootState } from "../../redux/store";
import { useSelector } from "react-redux";
import { getFirebaseDocs } from "../../api/getFirebaseDocs/getFirebaseDocs";
import { Student } from "./Student.interface";
import CreateAccountModal from "../../components/Modal/CreateAccountModa";
import MiPerfilModal from "../../components/Modal/EditUserModal";
import { updateFirebaseDoc } from "../../api/updateFirebaseDoc/updateFirebaseDoc";

const Students = () => {
  const [filteredData, setFilteredData] = useState<Student[]>([]);
  const [filterText, setFilterText] = useState("");
  const [showCreateAccountModal, setShowCreateAccountModal] = useState(false); // Estado para controlar la visibilidad del modal
  const [showEditAccountModal, setShowEditAccountModal] = useState(false); // Estado para controlar la visibilidad del modal
  const [selectedUser, setSelectedUser] = useState<Student | null>(null);
  const [selectedSearch, setSelectedSearch] = useState("");
  const [inputState, setInputState] = useState(true)

  // React-router-dom
  const navigate = useNavigate();
  // Redux Hooks & Access
  const user = useSelector((state: RootState) => state.auth.user);
  const loggedIn = useSelector((state: RootState) => state.auth.loggedIn);

  const columns = [
    {
      name: "Nombre",
      selector: (row: any) => row.nombre,
      sortable: true,
    },

    {
      name: "Cédula",
      selector: (row: any) => row.cedula,
      sortable: true,
    },
    {
      name: "Télefono",
      selector: (row: any) => row.telefono,
      sortable: true,
    },
    {
      name: "Correo",
      selector: (row: any) => row.correo,
      sortable: true,
      width: "250px",
    },
    {
      name: "Estado",
      cell: (row: any) => (
        <div className="form-check form-switch">
          <input
            className="form-check-input"
            type="checkbox"
            role="switch"
            checked={row.estado}
            onChange={() => handleSwitchToggle(row)}
          ></input>
        </div>
      ),
      width: "5vw",
    },
    {
      name: "Ver",
      cell: (row: any) => (
        <button
          className="btn btn-primary"
          onClick={() => handleButtonClick(row)}
        >
          <FaAddressCard />
        </button>
      ),
      width: "5vw",
    },
    {
      name: "Editar",
      cell: (row: any) => (
        <button
          className="btn btn-warning"
          onClick={() => handleButtonClick(row)}
        >
          <FaEdit />
        </button>
      ),
      width: "5vw",
    },
    {
      name: "Eliminar",
      cell: (row: any) => (
        <button
          className="btn btn-danger"
          onClick={() => console.log("eliminando...")}
        >
          <MdDelete />
        </button>
      ),
      width: "6vw",
    },
  ];

  // Redireccionar si está no logueado, y no hay usuario
  useEffect(() => {
    getUsers();
    if (!loggedIn && !user) {
      navigate("/");
    }
  }, [loggedIn, user, navigate]);

  useEffect(() => {
    if (filterText !== "") {
      const filtered = filteredData.filter((item) => {
        const selectedValue = item[selectedSearch];
        if (typeof selectedValue === "string") {
          return selectedValue.toLowerCase().includes(filterText.toLowerCase());
        }
      });
      setFilteredData(filtered);
    } else {
      getUsers();
    }
  }, [filterText, selectedSearch]);

  const getUsers = async () => {
    const data = await getFirebaseDocs("Usuarios");
    var formatedData: Student[] = [];
    formatedData = data.map((student: any) => ({
      nombre: student.nombre,
      id: student.id,
      canton: student.canton,
      cedula: student.cedula,
      correo: student.correo,
      direccion: student.direccion,
      distrito: student.distrito,
      estado: student.estado,
      fechaNacimiento: student.fechaNacimiento,
      genero: student.genero,
      provincia: student.provincia,
      telefono: student.telefono,
      user_type: student.user_type,
    }));
    formatedData.sort((a, b) =>
      a.nombre.localeCompare(b.nombre, "en", { sensitivity: "base" })
    );
    setFilteredData(formatedData);
  };

  const openCreateAccountModal = () => {
    setShowCreateAccountModal(true); // Función para abrir el modal
  };

  const closeCreateAccountModal = () => {
    setShowCreateAccountModal(false); // Función para cerrar el modal
  };

  const openEditAccountModal = () => {
    setShowEditAccountModal(true); // Función para abrir el modal
  };

  const closeEditAccountModal = () => {
    setShowEditAccountModal(false); // Función para cerrar el modal
  };

  const handleButtonClick = (usuario: Student): void => {
    console.log("Button clicked for:", usuario);
    openEditAccountModal();
    setSelectedUser(usuario);
  };

  function handleSwitchToggle(row: any): void {
    updateFirebaseDoc(`/Usuarios/${row.id}`, {
      estado: row.estado === 0 ? 1 : 0,
    });
    getUsers();
  }

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedSearch(event.target.value);
    if(inputState){
      setInputState(!inputState);
    }
  };

  return (
    <div style={{ top: "18%", left: "10%", right: "10%", bottom: "10%" }}>
      <div className="shadow-lg p-3">
        <h2 className="text-secondary mb-0 pt-3 ps-2 ">
          Listado General de Usuarios
        </h2>
        <div className="d-flex justify-content-between mb-2">
          <div className="d-flex">
            <button
              className="btn btn-success py-0 ms-2 mt-3 shadow"
              style={{ height: "35px" }}
              onClick={openCreateAccountModal} // Asocia la función de apertura del modal al evento onClick del botón
            >
              Crear Usuario
            </button>
          </div>
          <div className="d-flex">
            <div className="mt-3 mx-2">
              <select
                className="form-select border border-secondary shadow"
                aria-label="Default select example"
                onChange={handleSelectChange}
              >
                <option hidden>Seleccione un filtro</option>
                <option value="nombre">Nombre</option>
                <option value="cedula">Cédula</option>
                <option value="telefono">Teléfono</option>
                <option value="correo">Correo</option>
              </select>
            </div>
            <div className="">
              <input
                type="text"
                className="form-control bg-light text-dark mt-3 me-2 border border-secondary shadow"
                placeholder="Buscar"
                value={filterText}
                disabled = {inputState}
                onChange={(e) => setFilterText(e.target.value)}
              />
            </div>
          </div>
        </div>
        <DataTableBase columns={columns} data={filteredData} />
      </div>
      {/* Modal para el formulario de creación de cuenta */}
      <CreateAccountModal
        mostrar={showCreateAccountModal}
        onClose={closeCreateAccountModal}
      />
      <MiPerfilModal
        mostrar={showEditAccountModal}
        onClose={closeEditAccountModal}
        usuario={selectedUser}
      />
    </div>
  );
};

export default Students;

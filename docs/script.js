document.addEventListener('DOMContentLoaded', () => {
    const numEquiposInput = document.getElementById('numEquipos');
    const confirmarNumeroBtn = document.getElementById('confirmarNumero');
    const equiposContainer = document.getElementById('equiposContainer');
    const listaEquipos = document.getElementById('listaEquipos');
    const listaJugadores = document.getElementById('listaJugadores');
    const confirmarEquiposBtn = document.getElementById('confirmarEquipos');
    const calendarioContainer = document.getElementById('calendarioContainer');
    const calendario = document.getElementById('calendario');
    const tablaContainer = document.getElementById('tablaContainer');
    const tablaPosiciones = document.getElementById('tablaPosiciones');
    const scrollIndicator = document.getElementById('scrollIndicator');
    const guardarCambiosBtn = document.getElementById('guardarCambios');
    const borrarTodoBtn = document.getElementById('borrarTodo');
    const collapsibleButton = document.querySelector('.collapsible-button');
    const collapsibleContent = document.querySelector('.collapsible-content');
    const confirmacionBorrar = document.getElementById('confirmacionBorrar');
    const confirmarBorrarBtn = document.getElementById('confirmarBorrar');
    const cancelarBorrarBtn = document.getElementById('cancelarBorrar');
    const passwordModal = document.getElementById('passwordModal');
    const passwordInput = document.getElementById('passwordInput');
    const submitPasswordBtn = document.getElementById('submitPassword');
    const cancelPasswordBtn = document.getElementById('cancelPassword');

    let equiposData = [];
    let partidosJugados = {};
    const PASSWORD = "santiagomarzorattielpichichi";

    // Cargar datos guardados
    cargarDatosGuardados();

    collapsibleButton.addEventListener('click', () => {
        collapsibleButton.classList.toggle('active');
        if (collapsibleContent.style.maxHeight) {
            collapsibleContent.style.maxHeight = null;
        } else {
            collapsibleContent.style.maxHeight = collapsibleContent.scrollHeight + "px";
        }
    });

    confirmarNumeroBtn.addEventListener('click', () => {
        const numEquipos = parseInt(numEquiposInput.value);
        if (numEquipos >= 4 && numEquipos <= 32 && numEquipos % 2 === 0) {
            listaEquipos.innerHTML = '';
            listaJugadores.innerHTML = '';
            for (let i = 1; i <= numEquipos; i++) {
                listaEquipos.innerHTML += `<li><input type="text" id="equipo${i}" placeholder="Equipo ${i}"></li>`;
                listaJugadores.innerHTML += `<li><input type="text" id="jugador${i}" placeholder="Jugador ${i}"></li>`;
            }
            equiposContainer.style.display = 'block';
            collapsibleContent.style.maxHeight = collapsibleContent.scrollHeight + "px";
            setupArrowNavigation();
        } else {
            alert('Por favor, ingrese un número par entre 4 y 32.');
        }
    });

    confirmarEquiposBtn.addEventListener('click', () => {
        equiposData = [];
        partidosJugados = {};
        const equiposInputs = listaEquipos.querySelectorAll('input');
        const jugadoresInputs = listaJugadores.querySelectorAll('input');

        equiposInputs.forEach((input, index) => {
            if (input.value.trim() !== '') {
                equiposData.push({
                    nombre: input.value.trim(),
                    jugador: jugadoresInputs[index].value.trim(),
                    puntos: 0,
                    pj: 0,
                    pg: 0,
                    pe: 0,
                    pp: 0,
                    gf: 0,
                    gc: 0,
                    dg: 0
                });
            }
        });

        if (equiposData.length < 4 || equiposData.length % 2 !== 0) {
            alert('Por favor, ingrese un número par de equipos (mínimo 4).');
            return;
        }

        const calendarioGenerado = generarCalendario(equiposData.map(e => e.nombre));
        mostrarCalendario(calendarioGenerado);
        mostrarTablaPosiciones();
        calendarioContainer.style.display = 'block';
        tablaContainer.style.display = 'block';
        scrollIndicator.style.display = 'block';
    });

    guardarCambiosBtn.addEventListener('click', () => {
        mostrarPasswordModal('guardar');
    });

    borrarTodoBtn.addEventListener('click', () => {
        confirmacionBorrar.style.display = 'block';
    });

    confirmarBorrarBtn.addEventListener('click', () => {
        confirmacionBorrar.style.display = 'none';
        mostrarPasswordModal('borrar');
    });

    cancelarBorrarBtn.addEventListener('click', () => {
        confirmacionBorrar.style.display = 'none';
    });

    submitPasswordBtn.addEventListener('click', () => {
        const enteredPassword = passwordInput.value;
        if (enteredPassword === PASSWORD) {
            if (passwordModal.dataset.action === 'guardar') {
                guardarDatos();
            } else if (passwordModal.dataset.action === 'borrar') {
                borrarTodo();
            }
            cerrarPasswordModal();
        } else {
            alert('Contraseña incorrecta. Inténtalo de nuevo.');
        }
    });

    cancelPasswordBtn.addEventListener('click', cerrarPasswordModal);

    function setupArrowNavigation() {
        const inputs = document.querySelectorAll('#listaEquipos input, #listaJugadores input');
        inputs.forEach((input, index) => {
            input.addEventListener('keydown', (e) => {
                if (e.key === 'ArrowDown' && index < inputs.length - 1) {
                    inputs[index + 1].focus();
                } else if (e.key === 'ArrowUp' && index > 0) {
                    inputs[index - 1].focus();
                }
            });
        });
    }

    function generarCalendario(equipos) {
        const n = equipos.length;
        const calendario = [];
        const rondas = n - 1;
        const equiposPorFecha = n / 2;

        for (let i = 0; i < rondas; i++) {
            const ronda = [];
            for (let j = 0; j < equiposPorFecha; j++) {
                const local = equipos[j];
                const visitante = equipos[n - 1 - j];
                ronda.push([local, visitante]);
            }
            calendario.push(ronda);
            equipos.splice(1, 0, equipos.pop());
        }

        return calendario;
    }

    function mostrarCalendario(calendarioGenerado) {
        let html = '';
        calendarioGenerado.forEach((ronda, index) => {
            html += `
            <div class="fecha">
                <h3>Fecha ${index + 1}</h3>
                <ul>
                    ${ronda.map((partido, partidoIndex) => `
                        <li class="partido" id="fecha${index + 1}_partido${partidoIndex + 1}">
                            <span class="equipo equipo-local">${partido[0]}</span>
                            <div class="goles-container">
                                <input type="number" class="goles-input" min="0" data-equipo="local">
                                <span class="vs">vs</span>
                                <input type="number" class="goles-input" min="0" data-equipo="visitante">
                            </div>
                            <span class="equipo equipo-visitante">${partido[1]}</span>
                        </li>
                    `).join('')}
                </ul>
            </div>`;
        });
        calendario.innerHTML = html;
        attachResultadoListeners();
    }

    function attachResultadoListeners() {
        document.querySelectorAll('.goles-input').forEach(input => {
            input.addEventListener('change', (e) => {
                const partidoElement = e.target.closest('.partido');
                const fecha = partidoElement.id.split('_')[0].replace('fecha', '');
                const partido = partidoElement.id.split('_')[1].replace('partido', '');
                actualizarResultado(fecha, partido);
            });
        });
    }

    function mostrarTablaPosiciones() {
        let html = `
        <tr>
            <th>Posición</th>
            <th>EQUIPOS</th>
            <th>Jugador</th>
            <th>PTs</th>
            <th>PJ</th>
            <th>PG</th>
            <th>PE</th>
            <th>PP</th>
            <th>GF</th>
            <th>GC</th>
            <th>DG</th>
        </tr>`;

        equiposData.sort((a, b) => {
            if (b.puntos !== a.puntos) return b.puntos - a.puntos;
            if (b.dg !== a.dg) return b.dg - a.dg;
            return a.nombre.localeCompare(b.nombre);
        });

        equiposData.forEach((equipo, index) => {
            html += `
            <tr>
                <td>#${index + 1}</td>
                <td>${equipo.nombre}</td>
                <td>${equipo.jugador}</td>
                <td>${equipo.puntos}</td>
                <td>${equipo.pj}</td>
                <td>${equipo.pg}</td>
                <td>${equipo.pe}</td>
                <td>${equipo.pp}</td>
                <td>${equipo.gf}</td>
                <td>${equipo.gc}</td>
                <td>${equipo.dg}</td>
            </tr>`;
        });

        tablaPosiciones.innerHTML = html;
    }

    window.actualizarResultado = function(fecha, partido) {
        const partidoElement = document.getElementById(`fecha${fecha}_partido${partido}`);
        const golesLocalInput = partidoElement.querySelector('input[data-equipo="local"]');
        const golesVisitanteInput = partidoElement.querySelector('input[data-equipo="visitante"]');
        const golesLocal = parseInt(golesLocalInput.value) || 0;
        const golesVisitante = parseInt(golesVisitanteInput.value) || 0;

        const equipoLocal = partidoElement.querySelector('.equipo-local');
        const equipoVisitante = partidoElement.querySelector('.equipo-visitante');

        const partidoId = `${fecha}_${partido}`;

        partidosJugados[partidoId] = {
            equipoLocal: equipoLocal.textContent,
            equipoVisitante: equipoVisitante.textContent,
            golesLocal,
            golesVisitante
        };

        recalcularEstadisticas();

        let color;
        if (golesLocal > golesVisitante) {
            color = 'linear-gradient(to right, #00FF00, #FF0000)';
            equipoLocal.style.color = 'white';
            equipoVisitante.style.color = 'white';
        } else if (golesLocal < golesVisitante) {
            color = 'linear-gradient(to left, #00FF00, #FF0000)';
            equipoLocal.style.color = 'white';
            equipoVisitante.style.color = 'white';
        } else {
            color = '#FFFF00';
            equipoLocal.style.color = 'black';
            equipoVisitante.style.color = 'black';
        }

        partidoElement.style.background = color;
        mostrarTablaPosiciones();
    }

    function recalcularEstadisticas() {
        equiposData.forEach(equipo => {
            equipo.puntos = 0;
            equipo.pj = 0;
            equipo.pg = 0;
            equipo.pe = 0;
            equipo.pp = 0;
            equipo.gf = 0;
            equipo.gc = 0;
            equipo.dg = 0;
        });

        Object.values(partidosJugados).forEach(partido => {
            const { equipoLocal, equipoVisitante, golesLocal, golesVisitante } = partido;
            actualizarEstadisticas(equipoLocal, golesLocal, golesVisitante);
            actualizarEstadisticas(equipoVisitante, golesVisitante, golesLocal);
        });
    }

    function actualizarEstadisticas(nombreEquipo, golesFavor, golesContra) {
        const equipo = equiposData.find(e => e.nombre === nombreEquipo);
        if (equipo) {
            equipo.pj += 1;
            equipo.gf += golesFavor;
            equipo.gc += golesContra;
            equipo.dg = equipo.gf - equipo.gc;

            if (golesFavor > golesContra) {
                equipo.pg += 1;
                equipo.puntos += 3;
            } else if (golesFavor === golesContra) {
                equipo.pe += 1;
                equipo.puntos += 1;
            } else {
                equipo.pp += 1;
            }
        }
    }

    function guardarDatos() {
        const datosGuardados = {
            equiposData,
            partidosJugados,
            numEquipos: numEquiposInput.value
        };
        
        fetch('/api/guardar', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(datosGuardados)
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Cambios guardados correctamente.');
            } else {
                alert('Error al guardar los cambios.');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error al guardar los cambios.');
        });
    }

    function cargarDatosGuardados() {
        fetch('/api/cargar')
        .then(response => response.json())
        .then(datosGuardados => {
            if (datosGuardados) {
                equiposData = datosGuardados.equiposData;
                partidosJugados = datosGuardados.partidosJugados;
                numEquiposInput.value = datosGuardados.numEquipos;

                if (equiposData.length > 0) {
                    const calendarioGenerado = generarCalendario(equiposData.map(e => e.nombre));
                    mostrarCalendario(calendarioGenerado);
                    mostrarTablaPosiciones();
                    calendarioContainer.style.display = 'block';
                    tablaContainer.style.display = 'block';
                    scrollIndicator.style.display = 'block';

                    Object.entries(partidosJugados).forEach(([partidoId, partido]) => {
                        const [fecha, partidoNum] = partidoId.split('_');
                        const partidoElement = document.getElementById(`fecha${fecha}_partido${partidoNum}`);
                        if (partidoElement) {
                            const golesLocalInput = partidoElement.querySelector('input[data-equipo="local"]');
                            const golesVisitanteInput = partidoElement.querySelector('input[data-equipo="visitante"]');
                            golesLocalInput.value = partido.golesLocal;
                            golesVisitanteInput.value = partido.golesVisitante;
                            actualizarResultado(fecha, partidoNum);
                        }
                    });
                }
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }

    function borrarTodo() {
        fetch('/api/borrar', {
            method: 'POST'
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                equiposData = [];
                partidosJugados = {};
                numEquiposInput.value = '';
                listaEquipos.innerHTML = '';
                listaJugadores.innerHTML = '';
                calendario.innerHTML = '';
                tablaPosiciones.innerHTML = '';
                equiposContainer.style.display = 'none';
                calendarioContainer.style.display = 'none';
                tablaContainer.style.display = 'none';
                scrollIndicator.style.display = 'none';
                alert('Todos los datos han sido borrados.');
            } else {
                alert('Error al borrar los datos.');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error al borrar los datos.');
        });
    }

    function mostrarPasswordModal(action) {
        passwordModal.dataset.action = action;
        passwordModal.style.display = 'block';
    }

    function cerrarPasswordModal() {
        passwordModal.style.display = 'none';
        passwordInput.value = '';
    }
});
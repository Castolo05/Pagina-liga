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

    let equiposData = [];

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
            setupArrowNavigation();
        } else {
            alert('Por favor, ingrese un número par entre 4 y 32.');
        }
    });

    confirmarEquiposBtn.addEventListener('click', () => {
        equiposData = [];
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
                            <span class="equipo-local">${partido[0]}</span>
                            <input type="number" class="goles-input" min="0" data-equipo="local" onchange="actualizarResultado(${index + 1}, ${partidoIndex + 1})">
                            <span class="vs">vs</span>
                            <input type="number" class="goles-input" min="0" data-equipo="visitante" onchange="actualizarResultado(${index + 1}, ${partidoIndex + 1})">
                            <span class="equipo-visitante">${partido[1]}</span>
                        </li>
                    `).join('')}
                </ul>
            </div>`;
        });
        calendario.innerHTML = html;
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

        const equipoLocal = partidoElement.querySelector('.equipo-local').textContent;
        const equipoVisitante = partidoElement.querySelector('.equipo-visitante').textContent;

        actualizarEstadisticas(equipoLocal, golesLocal, golesVisitante);
        actualizarEstadisticas(equipoVisitante, golesVisitante, golesLocal);

        let color;
        if (golesLocal > golesVisitante) {
            color = 'linear-gradient(to right, #4CAF50, #F44336)';
        } else if (golesLocal < golesVisitante) {
            color = 'linear-gradient(to left, #4CAF50, #F44336)';
        } else {
            color = '#FFEB3B';
        }

        partidoElement.style.background = color;
        mostrarTablaPosiciones();
    }

    function actualizarEstadisticas(nombreEquipo, golesFavor, golesContra) {
        const equipo = equiposData.find(e => e.nombre === nombreEquipo);
        if (equipo) {
            equipo.pj++;
            equipo.gf += golesFavor;
            equipo.gc += golesContra;
            equipo.dg = equipo.gf - equipo.gc;

            if (golesFavor > golesContra) {
                equipo.pg++;
                equipo.puntos += 3;
            } else if (golesFavor === golesContra) {
                equipo.pe++;
                equipo.puntos += 1;
            } else {
                equipo.pp++;
            }
        }
    }
});
import React, { useState } from 'react';

const Rutas = () => {
  const [selectedRuta, setSelectedRuta] = useState(null);

  const rutas = [
    {
      id: 1,
      nombre: 'ZONA A - RUTA 1: TRUJILLO',
      descripcion: '𝗥𝗲𝗰𝗼𝗿𝗿𝗶𝗱𝗼: Pasaje Santa Fe, malecón Virgen del Carmen, Trujillo, Oswaldo Barreto, pje. Andrés Bello, Amauta, pje. Fernandino, pje. Ana Mayer, pje. Horacio Zevallos, Av. Circunvalación, pje. Salazar Bondy, calle Trujillo (la Cantuta, Incho ida y vuelta, Unión Victoria, la Molina, puente Antúnez de Mayolo), las Begonias y magnolias, así como las calles Aries y Atalaya, pje. Genesis, Calle independencia, Rubén Dario, Mario Solis, Urb. Las Casuarinas, Circuito Huaytapallana, condominio El Edén, los Ángeles, y calle Progreso.',
      image: require('../../../assets/img/rutas/ZONA_A_RUTA_1.jpg'),
    },
    {
      id: 2,
      nombre: 'ZONA A - RUTA 2: JUAN PARRA DEL RIEGO',
      descripcion: '𝗥𝗲𝗰𝗼𝗿𝗿𝗶𝗱𝗼: Calle Santa Rosa, Los Ángeles, 1ro de Mayo, Carhuallanqui, San José de Bellavista, Santa Barbará, parque Umuto alrededores, Sebastián Orellana, Domingo de Guzmán, pje. San Marcos, San Lucas, San Judas, calles San José, calle Unión, Santa Barbará, pje. Los Girasoles, Huayna Capac, Oswaldo Barreto, Inca Ripac, Faustino Quispe, Ferrocarril, Los Manzanos, San Cristóbal, pje. 14 de Junio, calle Urpi, Wari, José María Arguedas, José Antonio Encinas, Emilio Barrantes, calle Cajatambo, Aguirre Morales, Los Lirios, San Isidro, prol. Huayna Capac, Los Jazmines, Ferrocarril, pje. San José.',
      image: require('../../../assets/img/rutas/ZONA_A_RUTA_2.jpg'),
    },
    {
      id: 3,
      nombre: 'ZONA B - RUTA 1: PROGRESO',
      descripcion: '𝗥𝗲𝗰𝗼𝗿𝗿𝗶𝗱𝗼: Huancavelica y Atalaya, Av. Mariscal Castilla, Ricardo Menéndez, Nemesio Raez hasta Rosario, canal CIMIRM, hasta Av. La Esperanza. Juan Velasco Alvarado, baja La Esperanza a Mariscal Castilla hasta pje. 08 de Noviembre. Av. Evitamiento, CIMIRM (todo) hasta la Av. Ricardo Menendez, hasta Nemesio Raez, hasta Primavera, baja a Mariscal Castilla, Progreso (todo) hasta Ferrocarril (todo) Av. Evitamiento, CIMIRM, sube por Ferrocarril hasta Primavera, baja 2 cuadras Pampón.',
      image: require('../../../assets/img/rutas/ZONA_B_RUTA_1.jpg'),
    },
    {
      id: 4,
      nombre: 'ZONA B - RUTA 2 : SEÑOR DE LOS MILAGROS TRES ESQUINAS',
      descripcion: '𝗥𝗲𝗰𝗼𝗿𝗿𝗶𝗱𝗼: Ferrocarril, 28 de Julio, Lobato, Huayna Capac, pje. Santa Teresa, Cajatambo, Túpac Amaru, Rosemberg, Inca Ripac, Cahuide, Oswaldo Barreto. Pje. Palomino, 8 de Octubre, pje. Montes de oca, Atahualpa, Sebastián Lorente, pje. Las Ñustas, pje. Los Chasquis, Rosemberg, Sagitario, pje. Santa Anita, prol. Mariátegui, Wiracocha, Los Chancas, Inti, Rosemberg, pje. Luren, Circunvalación, pje. Kero, Mochica- Narda, Mineruz, Salcantay, pje. Misti y Saandino, pje. Cahuide, Huáscar, Ferrocarril.',
      image: require('../../../assets/img/rutas/ZONA_B_RUTA_2.jpg'),
    },
    {
      id: 5,
      nombre: 'ZONA C - RUTA 1 : GONZALES',
      descripcion: '𝗥𝗲𝗰𝗼𝗿𝗿𝗶𝗱𝗼: Av. Huancavelica y Gabriela Mistral (1ra puerta emergencia EsSalud) hasta Melchor Gonzáles (todo) hasta pje. Rosales, todo Rebagliati hasta Huancavelica, pje. Almenara, Lope de Vega hasta Jorge Basadre, Belaúnde, Atalaya hasta Huancavelica, Ricardo Menéndez hasta Mariscal Castilla, vuelta por pje. Tumbes (todo) hasta Huancavelica, Conquistadores hasta Arequipa, Evitamiento.',
      image: require('../../../assets/img/rutas/ZONA_C_RUTA_1.jpg'),
    },
    {
      id: 6,
      nombre: 'ZONA C - RUTA 2 : PRIMERO DE MAYO',
      descripcion: '𝗥𝗲𝗰𝗼𝗿𝗿𝗶𝗱𝗼: Pje. Plata, Diamante Azul, Jr. Arequipa, Flor de Mayo, Dolomita, Amatista, Barinita, Ambar, Andalucita, Flor de Mayo, Turmalina, Jr. estibina, pje. Riolita, pje. Titanita, Granito, calle Uno, Ricardo Neyra, Terquezas, Av. Huancavelica, la Cantuta, las Perlas, Los Rubies, Las Esmeraldas, los Topacios, las Gemas, Zafiros, Diademas, Gladiolos, Eugenia Meza, Agua Marina, Mármoles, Brillantes, Jr. Amazonita, Jr. Andalucita, Jr. Arequipa, Barinita, Av. Mariscal Castilla.',
      image: require('../../../assets/img/rutas/ZONA_C_RUTA_2.jpg'),
    },
  ];

  const openModal = (ruta) => {
    setSelectedRuta(ruta);
  };

  const closeModal = () => {
    setSelectedRuta(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-3 bg-white border-b border-gray-200">
        <h1 className="text-base font-medium text-gray-900">
          RECOLECT<span className="text-green-600">IA</span>
        </h1>
        <span className="text-xs text-gray-500">Rutas</span>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4 overflow-y-auto">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4">
          {rutas.map((ruta) => (
            <button
              key={ruta.id}
              onClick={() => openModal(ruta)}
              className="bg-white rounded-lg border border-gray-200 overflow-hidden text-left hover:shadow-md transition-shadow duration-200 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <img
                src={ruta.image}
                alt={ruta.nombre}
                className="w-full h-48 object-contain bg-gray-50"
                onError={(e) => (e.target.src = 'https://via.placeholder.com/400x300?text=Ruta')}
              />
              <div className="p-4">
                <h3 className="text-sm font-medium text-gray-900 mb-2">{ruta.nombre}</h3>
                <p className="text-xs text-gray-500 line-clamp-3">{ruta.descripcion}</p>
              </div>
            </button>
          ))}
        </div>
      </main>

      {/* Bottom Padding */}
      <div className="h-16" />

      {/* Modal */}
      {selectedRuta && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={closeModal}>
          <div 
            className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto relative" 
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={closeModal}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 focus:outline-none"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="p-4 sm:p-6">
              <img
                src={selectedRuta.image}
                alt={selectedRuta.nombre}
                className="w-full h-auto object-contain mb-4"
                onError={(e) => (e.target.src = 'https://via.placeholder.com/800x600?text=Ruta')}
              />
              <h3 className="text-base font-medium text-gray-900 mb-2">{selectedRuta.nombre}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{selectedRuta.descripcion}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Rutas;
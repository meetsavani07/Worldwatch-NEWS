import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, CircleMarker, Tooltip } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useNewsStore } from '../store';

const supportedCountries = [
  { name: 'Afghanistan', coords: [33.93911, 67.709953] },
  { name: 'Albania', coords: [41.153332, 20.168331] },
  { name: 'Algeria', coords: [28.033886, 1.659626] },
  { name: 'Andorra', coords: [42.546245, 1.601554] },
  { name: 'Angola', coords: [-11.202692, 17.873887] },
  { name: 'Antigua and Barbuda', coords: [17.060816, -61.796428] },
  { name: 'Argentina', coords: [-38.416097, -63.616672] },
  { name: 'Armenia', coords: [40.069099, 45.038189] },
  { name: 'Australia', coords: [-25.274398, 133.775136] },
  { name: 'Austria', coords: [47.516231, 14.550072] },
  { name: 'Azerbaijan', coords: [40.143105, 47.576927] },
  { name: 'Bahamas', coords: [25.03428, -77.39628] },
  { name: 'Bahrain', coords: [25.930414, 50.637772] },
  { name: 'Bangladesh', coords: [23.684994, 90.356331] },
  { name: 'Barbados', coords: [13.193887, -59.543198] },
  { name: 'Belarus', coords: [53.709807, 27.953389] },
  { name: 'Belgium', coords: [50.503887, 4.469936] },
  { name: 'Belize', coords: [17.189877, -88.49765] },
  { name: 'Benin', coords: [9.30769, 2.315834] },
  { name: 'Bhutan', coords: [27.514162, 90.433601] },
  { name: 'Bolivia', coords: [-16.290154, -63.588653] },
  { name: 'Bosnia and Herzegovina', coords: [43.915886, 17.679076] },
  { name: 'Botswana', coords: [-22.328474, 24.684866] },
  { name: 'Brazil', coords: [-14.235004, -51.92528] },
  { name: 'Brunei', coords: [4.535277, 114.727669] },
  { name: 'Bulgaria', coords: [42.733883, 25.48583] },
  { name: 'Burkina Faso', coords: [12.238333, -1.561593] },
  { name: 'Burundi', coords: [-3.373056, 29.918886] },
  { name: 'Cabo Verde', coords: [16.002082, -24.013197] },
  { name: 'Cambodia', coords: [12.565679, 104.990963] },
  { name: 'Cameroon', coords: [7.369722, 12.354722] },
  { name: 'Canada', coords: [56.130366, -106.346771] },
  { name: 'Central African Republic', coords: [6.611111, 20.939444] },
  { name: 'Chad', coords: [15.454166, 18.732207] },
  { name: 'Chile', coords: [-35.675147, -71.542969] },
  { name: 'China', coords: [35.86166, 104.195397] },
  { name: 'Colombia', coords: [4.570868, -74.297333] },
  { name: 'Comoros', coords: [-11.875001, 43.872219] },
  { name: 'Congo (Congo-Brazzaville)', coords: [-0.228021, 15.827659] },
  { name: 'Costa Rica', coords: [9.748917, -83.753428] },
  { name: 'Croatia', coords: [45.1, 15.2] },
  { name: 'Cuba', coords: [21.521757, -77.781167] },
  { name: 'Cyprus', coords: [35.126413, 33.429859] },
  { name: 'Czechia (Czech Republic)', coords: [49.817492, 15.472962] },
  { name: 'Democratic Republic of the Congo', coords: [-4.038333, 21.758664] },
  { name: 'Denmark', coords: [56.26392, 9.501785] },
  { name: 'Djibouti', coords: [11.825138, 42.590275] },
  { name: 'Dominica', coords: [15.414999, -61.370976] },
  { name: 'Dominican Republic', coords: [18.735693, -70.162651] },
  { name: 'Ecuador', coords: [-1.831239, -78.183406] },
  { name: 'Egypt', coords: [26.820553, 30.802498] },
  { name: 'El Salvador', coords: [13.794185, -88.89653] },
  { name: 'Equatorial Guinea', coords: [1.650801, 10.267895] },
  { name: 'Eritrea', coords: [15.179384, 39.782334] },
  { name: 'Estonia', coords: [58.595272, 25.013607] },
  { name: 'Eswatini (fmr. "Swaziland")', coords: [-26.522503, 31.465866] },
  { name: 'Ethiopia', coords: [9.145, 40.489673] },
  { name: 'Fiji', coords: [-16.578193, 179.414413] },
  { name: 'Finland', coords: [61.92411, 25.748151] },
  { name: 'France', coords: [46.603354, 1.888334] },
  { name: 'Gabon', coords: [-0.803689, 11.609444] },
  { name: 'Gambia', coords: [13.443182, -15.310139] },
  { name: 'Georgia', coords: [42.315407, 43.356892] },
  { name: 'Germany', coords: [51.165691, 10.451526] },
  { name: 'Ghana', coords: [7.946527, -1.023194] },
  { name: 'Greece', coords: [39.074208, 21.824312] },
  { name: 'Grenada', coords: [12.262776, -61.604171] },
  { name: 'Guatemala', coords: [15.783471, -90.230759] },
  { name: 'Guinea', coords: [9.945587, -9.696645] },
  { name: 'Guinea-Bissau', coords: [11.803749, -15.180413] },
  { name: 'Guyana', coords: [4.860416, -58.93018] },
  { name: 'Haiti', coords: [18.971187, -72.285215] },
  { name: 'Honduras', coords: [13.794185, -88.89653] },
  { name: 'Hungary', coords: [47.162494, 19.503304] },
  { name: 'Iceland', coords: [64.963051, -19.020835] },
  { name: 'India', coords: [20.593684, 78.96288] },
  { name: 'Indonesia', coords: [-0.789275, 113.921327] },
  { name: 'Iran', coords: [32.427908, 53.688046] },
  { name: 'Iraq', coords: [33.223191, 43.679291] },
  { name: 'Ireland', coords: [53.41291, -8.24389] },
  { name: 'Israel', coords: [31.046051, 34.851612] },
  { name: 'Italy', coords: [41.87194, 12.56738] },
  { name: 'Jamaica', coords: [18.109581, -77.297508] },
  { name: 'Japan', coords: [36.204824, 138.252924] },
  { name: 'Jordan', coords: [30.585164, 36.238414] },
  { name: 'Kazakhstan', coords: [48.019573, 66.923684] },
  { name: 'Kenya', coords: [-1.292066, 36.821946] },
  { name: 'Kiribati', coords: [1.870883, -157.363026] },
  { name: 'Kuwait', coords: [29.31166, 47.481766] },
  { name: 'Kyrgyzstan', coords: [41.20438, 74.766098] },
  { name: 'Laos', coords: [19.85627, 102.495496] },
  { name: 'Latvia', coords: [56.879635, 24.603189] },
  { name: 'Lebanon', coords: [33.854721, 35.862285] },
  { name: 'Lesotho', coords: [-29.609988, 28.233608] },
  { name: 'Liberia', coords: [6.428055, -9.429499] },
  { name: 'Libya', coords: [26.3351, 17.228331] },
  { name: 'Liechtenstein', coords: [47.166, 9.555373] },
  { name: 'Lithuania', coords: [55.169438, 23.881275] },
  { name: 'Luxembourg', coords: [49.815273, 6.129583] },
  { name: 'Madagascar', coords: [-18.766947, 46.869107] },
  { name: 'Malawi', coords: [-13.254308, 34.301525] },
  { name: 'Malaysia', coords: [4.210484, 101.975766] },
  { name: 'Maldives', coords: [3.202778, 73.22068] },
  { name: 'Mali', coords: [17.570692, -3.996166] },
  { name: 'Malta', coords: [35.937496, 14.375416] },
  { name: 'Marshall Islands', coords: [7.131474, 171.184478] },
  { name: 'Mauritania', coords: [21.00789, -10.940835] },
  { name: 'Mauritius', coords: [-20.348404, 57.552152] },
  { name: 'Mexico', coords: [23.634501, -102.552784] },
  { name: 'Micronesia', coords: [7.425554, 150.550812] },
  { name: 'Moldova', coords: [47.411631, 28.369885] },
  { name: 'Monaco', coords: [43.750298, 7.412841] },
  { name: 'Mongolia', coords: [46.862496, 103.846656] },
  { name: 'Montenegro', coords: [42.708678, 19.37439] },
  { name: 'Morocco', coords: [31.791702, -7.09262] },
  { name: 'Mozambique', coords: [-18.665695, 35.529562] },
  { name: 'Myanmar (Burma)', coords: [21.916221, 95.955974] },
  { name: 'Namibia', coords: [-22.95764, 18.49041] },
  { name: 'Nauru', coords: [-0.522778, 166.931503] },
  { name: 'Nepal', coords: [28.394857, 84.124008] },
  { name: 'Netherlands', coords: [52.132633, 5.291266] },
  { name: 'New Zealand', coords: [-40.900557, 174.885971] },
  { name: 'Nicaragua', coords: [12.865416, -85.207229] },
  { name: 'Niger', coords: [17.607789, 8.081666] },
  { name: 'Nigeria', coords: [9.081999, 8.675277] },
  { name: 'North Korea', coords: [40.339852, 127.510093] },
  { name: 'North Macedonia', coords: [41.608635, 21.745275] },
  { name: 'Norway', coords: [60.472024, 8.468946] },
  { name: 'Oman', coords: [21.512583, 55.923255] },
  { name: 'Pakistan', coords: [30.375321, 69.345116] },
  { name: 'Palau', coords: [7.51498, 134.58252] },
  { name: 'Panama', coords: [8.537981, -80.782127] },
  { name: 'Papua New Guinea', coords: [-6.314993, 143.95555] },
  { name: 'Paraguay', coords: [-23.442503, -58.443832] },
  { name: 'Peru', coords: [-9.189967, -75.015152] },
  { name: 'Philippines', coords: [12.879721, 121.774017] },
  { name: 'Poland', coords: [51.919438, 19.145136] },
  { name: 'Portugal', coords: [39.399872, -8.224454] },
  { name: 'Qatar', coords: [25.354826, 51.183884] },
  { name: 'Romania', coords: [45.943161, 24.96676] },
  { name: 'Russia', coords: [61.52401, 105.318756] },
  { name: 'Rwanda', coords: [-1.940278, 29.873888] },
  { name: 'Saint Kitts and Nevis', coords: [17.357822, -62.782998] },
  { name: 'Saint Lucia', coords: [13.909444, -60.978893] },
  { name: 'Saint Vincent and the Grenadines', coords: [12.984305, -61.287228] },
  { name: 'Samoa', coords: [-13.759029, -172.104629] },
  { name: 'San Marino', coords: [43.933333, 12.45] },
  { name: 'Sao Tome and Principe', coords: [0.18636, 6.613081] },
  { name: 'Saudi Arabia', coords: [23.885942, 45.079162] },
  { name: 'Senegal', coords: [14.497401, -14.452362] },
  { name: 'Serbia', coords: [44.016521, 21.005859] },
  { name: 'Seychelles', coords: [-4.679574, 55.491977] },
  { name: 'Sierra Leone', coords: [8.460555, -11.779889] },
  { name: 'Singapore', coords: [1.352083, 103.819836] },
  { name: 'Slovakia', coords: [48.669026, 19.699024] },
  { name:  'Slovenia', coords: [46.151241, 14.995463] },
  { name: 'Solomon Islands', coords: [-9.64571, 160.156194] },
  { name: 'Somalia', coords: [5.152149, 46.199616] },
  { name: 'South Africa', coords: [-30.559482, 22.937506] },
  { name: 'South Korea', coords: [35.907757, 127.766922] },
  { name: 'South Sudan', coords: [6.877, 31.307] },
  { name: 'Spain', coords: [40.463667, -3.74922] },
  { name: 'Sri Lanka', coords: [7.873054, 80.771797] },
  { name: 'Sudan', coords: [12.862807, 30.217636] },
  { name: 'Suriname', coords: [3.919305, -56.027783] },
  { name: 'Sweden', coords: [60.128161, 18.643501] },
  { name: 'Switzerland', coords: [46.818188, 8.227512] },
  { name: 'Syria', coords: [34.802075, 38.996815] },
  { name: 'Taiwan', coords: [23.69781, 120.960515] },
  { name: 'Tajikistan', coords: [38.861034, 71.276093] },
  { name: 'Tanzania', coords: [-6.369028, 34.888822] },
  { name: 'Thailand', coords: [15.870032, 100.992541] },
  { name: 'Timor-Leste', coords: [-8.874217, 125.727539] },
  { name: 'Togo', coords: [8.619543, 0.824782] },
  { name: 'Tonga', coords: [-21.178986, -175.198242] },
  { name: 'Trinidad and Tobago', coords: [10.691803, -61.222503] },
  { name: 'Tunisia', coords: [33.886917, 9.537499] },
  { name: 'Turkey', coords: [38.963745, 35.243322] },
  { name: 'Turkmenistan', coords: [38.969719, 59.556278] },
  { name: 'Tuvalu', coords: [-7.109535, 177.64933] },
  { name: 'Uganda', coords: [1.373333, 32.290275] },
  { name: 'Ukraine', coords: [48.379433, 31.16558] },
  { name: 'United Arab Emirates', coords: [23.424076, 53.847818] },
  { name: 'United Kingdom', coords: [55.378051, -3.435973] },
  { name: 'United States', coords: [37.09024, -95.712891] },
  { name: 'Uruguay', coords: [-32.522779, -55.765835] },
  { name: 'Uzbekistan', coords: [41.377491, 64.585262] },
  { name: 'Vanuatu', coords: [-15.376706, 166.959158] },
  { name: 'Vatican City', coords: [41.902916, 12.453389] },
  { name: 'Venezuela', coords: [6.42375, -66.58973] },
  { name: 'Vietnam', coords: [14.058324, 108.277199] },
  { name: 'Yemen', coords: [15.552727, 48.516388] },
  { name: 'Zambia', coords: [-13.133897, 27.849332] },
  { name: 'Zimbabwe', coords: [-19.015438, 29.154857] },
];
const WorldMap = () => {
  const { selectedCountry, setSelectedCountry, darkMode } = useNewsStore();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    // Fix for Leaflet icon paths
    delete (window as any)._leaflet_disable_pointer_events_on_resize;
  }, []);

  return (
    <div className={`w-full sm:w-[1000px] h-[300px] sm:h-[450px] ${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md p-2 sm:p-4 relative mb-8 z-0 mx-auto mt-4 sm:mt-20`}>
      <MapContainer
        center={[20, 0]}
        zoom={isMobile ? 0 : 1}
        style={{ height: '100%', width: '100%', background: darkMode ? '#1F2937' : '#ffffff' }}
        attributionControl={false}
        className="z-0"
        worldCopyJump={true}
        maxBounds={[[-90, -180], [90, 180]]}
      >
        <TileLayer
          url={darkMode 
            ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          }
          noWrap={false}
        />
        {supportedCountries.map((country) => (
          <CircleMarker
            key={country.name}
            center={country.coords as [number, number]}
            radius={selectedCountry === country.name ? (isMobile ? 4 : 8) : (isMobile ? 3 : 6)}
            eventHandlers={{
              click: () => setSelectedCountry(selectedCountry === country.name ? null : country.name),
            }}
            pathOptions={{
              fillColor: selectedCountry === country.name ? '#2563eb' : '#93c5fd',
              fillOpacity: 0.8,
              color: darkMode ? '#4B5563' : '#ffffff',
              weight: 2,
              className: 'cursor-pointer'
            }}
          >
            <Tooltip>
              <div className="text-center">
                <div className="font-semibold">{country.name}</div>
                <div className="text-xs opacity-75">Click for news</div>
              </div>
            </Tooltip>
          </CircleMarker>
        ))}
      </MapContainer>
    </div>
  );
};


export default WorldMap;
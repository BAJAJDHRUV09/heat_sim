import { Card } from 'antd';
import { useNavigate } from 'react-router-dom';

const { Meta } = Card;

const Home = () => {
  const navigate = useNavigate();

  const handleCardClick = (path: string) => {
    window.open(`/#${path}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 text-center mb-4">
          Heat Transfer Simulations
        </h1>
        <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
          Explore interactive simulations of various heat transfer phenomena
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card
            hoverable
            className="transform transition-all duration-300 hover:scale-105 hover:shadow-2xl cursor-pointer bg-white border-0 rounded-xl overflow-hidden"
            onClick={() => handleCardClick('/boundary-layer')}
            bodyStyle={{ padding: '2rem' }}
          >
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Boundary Layer Analysis</h3>
              <p className="text-gray-600">Interactive visualization of boundary layer development with adjustable parameters</p>
            </div>
          </Card>

          <Card
            hoverable
            className="transform transition-all duration-300 hover:scale-105 hover:shadow-2xl cursor-pointer bg-white border-0 rounded-xl overflow-hidden"
            onClick={() => handleCardClick('/thermal-boundary-layer')}
            bodyStyle={{ padding: '2rem' }}
          >
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Thermal Boundary Layer Simulation</h3>
              <p className="text-gray-600">Explore thermal boundary layer development with different fluid properties</p>
            </div>
          </Card>

          <Card
            hoverable
            className="transform transition-all duration-300 hover:scale-105 hover:shadow-2xl cursor-pointer bg-white border-0 rounded-xl overflow-hidden"
            onClick={() => handleCardClick('/natural-convection')}
            bodyStyle={{ padding: '2rem' }}
          >
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Natural Convection Analysis</h3>
              <p className="text-gray-600">Explore natural convection over a vertical plate with different Prandtl numbers</p>
            </div>
          </Card>

          <Card
            hoverable
            className="transform transition-all duration-300 hover:scale-105 hover:shadow-2xl cursor-pointer bg-white border-0 rounded-xl overflow-hidden"
            onClick={() => handleCardClick('/fourier-modes')}
            bodyStyle={{ padding: '2rem' }}
          >
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Fourier Modes Analysis</h3>
              <p className="text-gray-600">Explore temperature evolution through Fourier series decomposition</p>
            </div>
          </Card>

          <Card
            hoverable
            className="transform transition-all duration-300 hover:scale-105 hover:shadow-2xl cursor-pointer bg-white border-0 rounded-xl overflow-hidden"
            bodyStyle={{ padding: '2rem' }}
          >
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Coming Soon</h3>
              <p className="text-gray-600">More simulations will be available soon</p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Home; 
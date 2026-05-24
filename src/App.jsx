import StarField from './components/StarField/StarField';
import Navbar from './components/Navbar/Navbar';
import Home from './pages/Home/Home';
import Footer from './components/Footer/Footer';

export default function App() {
  return (
    <>
      <StarField count={180} />
      <Navbar />
      <Home />
      <Footer />
    </>
  );
}

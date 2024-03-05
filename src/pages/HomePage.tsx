import { Link } from "react-router-dom"
import { useAuth } from "../hooks/useAuth"
import { removeUser } from "../store/slices/userSlice";
import { useAppDispatch } from "../hooks/reduxHooks";
import React, { useEffect, useState } from "react";
import MapComponent from "../components/MapComponent";
import { firestore } from "../firebase";

const HomePage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { isAuth, email } = useAuth();
  const [markers, setMarkers] = useState<{ id: string; lat: number; lng: number; }[]>([]);

  useEffect(() => {
    const unsubscribe = firestore.collection('quests').onSnapshot(snapshot => {
      const data: { id: string; lat: number; lng: number; }[] = snapshot.docs.map(doc => ({
        id: doc.id,
        lat: doc.data().lat || 0, // Заглушка для поля lat
        lng: doc.data().lng || 0, // Заглушка для поля lng
      }));
      setMarkers(data);
    });
  
    return () => unsubscribe();
  }, []);
  

  const handleMapClick = (event: google.maps.MapMouseEvent) => {
    const latlng = event.latLng;
    if (latlng) {
      const newMarker = { lat: latlng.lat(), lng: latlng.lng() };
      firestore.collection('quests').add({
        location: newMarker,
        timestamp: new Date().toISOString(),
      })
      .then((docRef) => {
        console.log('New quest added with ID: ', docRef.id);
      })
      .catch((error) => {
        console.error('Error adding new quest: ', error);
      });
    }
  };

  const handleDeleteAllMarkers = () => {
    markers.forEach(marker => {
      firestore.collection('quests').doc(marker.id).delete()
        .then(() => {
          console.log('Marker deleted from Firestore');
        })
        .catch((error) => {
          console.error('Error deleting marker from Firestore: ', error);
        });
    });
    setMarkers([]);
  };

  const handleMarkerDragEnd = (index: number, event: google.maps.MapMouseEvent) => {
    const latlng = event.latLng;
    if (latlng) {
      const newMarkers = markers.map((marker, idx) => {
        if (idx === index) {
          return { id: '', lat: latlng.lat(), lng: latlng.lng() }; // Присваиваем пустую строку id
        }
        return marker;
      });
      setMarkers(newMarkers);
    }
  };  
  
  const handleMarkerClick = (index: number) => {
    const newMarkers = [...markers];
    newMarkers.splice(index, 1);
    setMarkers(newMarkers);
  };

  return isAuth ? (
    <div>
      <h1>Welcome</h1>

      <div>
        <h1>Map App</h1>
          <MapComponent 
            markers={markers} 
            onMapClick={handleMapClick} 
            onMarkerDragEnd={handleMarkerDragEnd} 
            onDeleteAllMarkers={handleDeleteAllMarkers} 
            deleteOneMarker={handleMarkerClick} />
      </div>
      <button onClick={handleDeleteAllMarkers}>Delete all markers</button>


      <button onClick={() => dispatch(removeUser())}>Log out from {email}</button>
    </div>
  ) : (
    <>
      <h1>Home</h1>
      <Link to='/login'>login</Link>
    </>
  )
}

export default HomePage
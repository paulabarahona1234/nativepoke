import { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, Image, TextInput, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import Filtro from './filtro'

export default function Lista() {
  const [data, setData] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [tipoSeleccionado, setTipoSeleccionado] = useState('All');
  const navigation = useNavigation();

  useEffect(() => {
    const obtenerDatos = async () => {
      if (tipoSeleccionado === 'All') {
        const res = await fetch("https://pokeapi.co/api/v2/pokemon?limit=1025");
        const json = await res.json();
        setData(json.results);
      } else {
        const res = await fetch(`https://pokeapi.co/api/v2/type/${tipoSeleccionado}`);
        const json = await res.json();
        const listaFiltrada = json.pokemon.map(p => p.pokemon);
        setData(listaFiltrada);
      }
    };
  
    obtenerDatos();
  }, [tipoSeleccionado]);



  let resultados = data;

  if (busqueda.length >= 3 && isNaN(busqueda)) {
    resultados = data.filter(pokemon =>
      pokemon.name.toLowerCase().includes(busqueda.toLowerCase())
    );
  } else if (!isNaN(busqueda) && busqueda !== '') {
    resultados = data.filter(pokemon =>
      pokemon.url.includes('/' + busqueda)
    );
  }
  

  return (
    
    <ScrollView>
      <TextInput
        style={styles.buscador}
        placeholder="Buscar Pokémon"
        value={busqueda}
        onChangeText={setBusqueda}
      />
      <Filtro onTipoChange={setTipoSeleccionado} />
      {/*console.log(resultados.length)*/}
      <View style={styles.lista}>
        {resultados.map((pokemon, index) => (
          <TouchableOpacity 
          key={index} 
          style={styles.item} 
          onPress={() => navigation.navigate('Pokemon', { nombre: pokemon.name })}// Redirige con pokemon.name como parámetro

          >
            <Text>{pokemon.url.split("/")[6]} {index}</Text>
            <Image
              source={{ uri: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.url.split("/")[6]}.png` }}
              style={styles.imagen}
            />
            <Text>{pokemon.name}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  lista: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 5,
    justifyContent: 'space-between', // para distribuir en 2 columnas
    padding: 10,
  },
  item: {
    backgroundColor: 'aliceblue',
    width: '48%', // equivalente a calc(50% - 5px)
    padding: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  imagen: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
  },
  buscador: {
    margin: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
  }  
});

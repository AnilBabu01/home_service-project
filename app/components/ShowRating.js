import React, { useState } from 'react';
import { View, Text } from 'react-native';
import Rating from '../components/Rating';
import { COLORS } from '../constants';

const ShowRating = () => {
  const [rating, setRating] = useState(0);

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>Rate this movie:</Text>
      <Rating color={COLORS.primary} rating={rating} setRating={setRating} />
      <Text style={{ marginTop: 10, fontSize: 16 }}>Your rating: {rating} / 5</Text>
    </View>
  );
};

export default ShowRating;

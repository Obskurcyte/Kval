import React from 'react';
import {StyleSheet, Text, View} from "react-native";
import {AntDesign} from "@expo/vector-icons";
import UserAvatar from 'react-native-user-avatar';

const AvisCard = ({name, commentaire, rating}) => {

    const FourStar = () => {
        return (
            <View style={{display: 'flex', flexDirection: 'row'}}>
                <AntDesign name="star" size={18} color="#FFC107" />
                <AntDesign name="star" size={18} color="#FFC107" />
                <AntDesign name="star" size={18} color="#FFC107" />
                <AntDesign name="star" size={18} color="#FFC107" />
            </View>
        )
    }
    const FiveStar = () => {
        return (
            <View style={{display: 'flex', flexDirection: 'row'}}>
                <AntDesign name="star" size={18} color="#FFC107" />
                <AntDesign name="star" size={18} color="#FFC107" />
                <AntDesign name="star" size={18} color="#FFC107" />
                <AntDesign name="star" size={18} color="#FFC107" />
                <AntDesign name="star" size={18} color="#FFC107" />
            </View>
        )
    }

    const ThreeStar = () => {
        return (
            <View style={{display: 'flex', flexDirection: 'row'}}>
                <AntDesign name="star" size={18} color="#FFC107" />
                <AntDesign name="star" size={18} color="#FFC107" />
                <AntDesign name="star" size={18} color="#FFC107" />
            </View>
        )
    }
    const TwoStar = () => {
        return (
            <View style={{display: 'flex', flexDirection: 'row'}}>
                <AntDesign name="star" size={18} color="#FFC107" />
                <AntDesign name="star" size={18} color="#FFC107" />
            </View>
        )
    }

    const OneStar = () => {
        return (
            <View style={{display: 'flex', flexDirection: 'row'}}>
                <AntDesign name="star" size={18} color="#FFC107" />
            </View>
        )
    }

    const initial = name.charAt(0);

    return (
        <View style={styles.avisContainer}>
            <View style={styles.avatarContainer}>
                <UserAvatar
                    size={50}
                    name={initial}
                />
            </View>
            <View style={styles.starsContainer}>
                <Text style={styles.avisText}>{name}</Text>
                {rating === 1 && <OneStar />}
                {rating === 2 && <TwoStar />}
                {rating === 3 && <ThreeStar />}
                {rating === 4 && <FourStar />}
                {rating === 5 && <FiveStar />}
                <Text>{commentaire}</Text>
            </View>
        </View>
    );
};


const styles = StyleSheet.create({
    avatarContainer: {
        width: 50,
    },
    avisContainer: {
        display: 'flex',
        flexDirection: 'row',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: 'lightgrey'
    },
    avisText: {
        fontWeight: 'bold',
        fontSize: 18,
    },
    starsContainer: {
        display: 'flex',
        flexDirection: 'column',
        marginLeft: 15
    }
})

export default AvisCard;
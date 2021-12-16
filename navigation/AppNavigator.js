import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import OnboardingScreen1 from "../screens/inscription/OnboardingScreen1";
import OnboardingScreen2 from "../screens/inscription/OnboardingScreen2";
import IdentificationScreen from "../screens/inscription/IdentificationScreen";
import InscriptionScreen from "../screens/inscription/InscriptionScreen";
import ConnectionScreen from "../screens/inscription/ConnectionScreen";
import VendreArticleScreen from "../screens/vente/VendreArticleScreen";
import PhotoArticleScreen from "../screens/vente/PhotoArticleScreen";
import MessageScreen from "../screens/messages/MessageScreen";
import ProfileScreen from "../screens/profile/ProfileScreen";
import AccueilScreen from "../screens/accueil/AccueilScreen";
import { AntDesign, Fontisto } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import CategoriesChoiceScreen from "../screens/vente/CategoriesChoiceScreen";
import MarquesChoiceScreen from "../screens/vente/MarquesChoiceScreen";
import EtatChoiceScreen from "../screens/vente/EtatChoiceScreen";
import ChevalEtCuirAccueilScreen from "../screens/achat/categories/ChevalEtCuirAccueilScreen";
import BrideriesAccueilScreen from "../screens/achat/sousCategoriesChevalEtCuir/BrideriesAccueilScreen";
import MorsAccueilScreen from "../screens/achat/sousCategoriesChevalEtCuir/MorsAccueilScreen";
import SanglesAccueilScreen from "../screens/achat/sousCategoriesChevalEtCuir/SanglesAccueilScreen";
import ColiersAccueilScreen from "../screens/achat/sousCategoriesChevalEtCuir/ColiersAccueilScreen";
import TravailAccueilScreen from "../screens/achat/sousCategoriesChevalEtCuir/TravailAccueilScreen";
import SelleAccueilScreen from "../screens/achat/sousCategoriesChevalEtCuir/SelleAccueilScreen";
import ChevalEtTextileAccueilScreen from "../screens/achat/categories/ChevalEtTextileAccueilScreen";
import ChemisesAccueilScreen from "../screens/achat/sousCategoriesChevalEtTextile/ChemisesAccueilScreen";
import CouverturesAccueilScreen from "../screens/achat/sousCategoriesChevalEtTextile/CouverturesAccueilScreen";
import LicolsAccueilScreen from "../screens/achat/sousCategoriesChevalEtTextile/LicolsAccueilScreen";
import ProtectionsAccueilScreen from "../screens/achat/sousCategoriesChevalEtTextile/ProtectionsAccueilScreen";
import CavalierAccueilScreen from "../screens/achat/categories/CavalierAccueilScreen";
import AccessoiresAccueilScreen from "../screens/achat/sousCategoriesCavalier/AccessoiresAccueilScreen";
import BottesAccueilScreen from "../screens/achat/sousCategoriesCavalier/BottesAccueilScreen";
import CasquesAccueilScreen from "../screens/achat/sousCategoriesCavalier/CasquesAccueilScreen";
import EnfantAccueilScreen from "../screens/achat/sousCategoriesCavalier/EnfantAccueilScreen";
import HommeAccueilScreen from "../screens/achat/sousCategoriesCavalier/HommeAccueilScreen";
import FemmeAccueilScreen from "../screens/achat/sousCategoriesCavalier/FemmeAccueilScreen";
import GiletAccueilScreen from "../screens/achat/sousCategoriesCavalier/GiletAccueilScreen";
import SoinsEtEcuriesAccueilScreen from "../screens/achat/categories/SoinsEtEcuriesAccueilScreen";
import AlimentsAccueilScreen from "../screens/achat/sousCategoriesSoinsEtEcuries/AlimentsAccueilScreen";
import ProduitsAccueilScreen from "../screens/achat/sousCategoriesSoinsEtEcuries/ProduitsAccueilScreen";
import MaterielAccueilScreen from "../screens/achat/sousCategoriesSoinsEtEcuries/MaterielAccueilScreen";
import TenturesAccueilScreen from "../screens/achat/sousCategoriesSoinsEtEcuries/TenturesAccueilScreen";
import EquipementsAccueilScreen from "../screens/achat/sousCategoriesSoinsEtEcuries/EquipementsAccueilScreen";
import ClotureAccueilScreen from "../screens/achat/sousCategoriesSoinsEtEcuries/ClotureAccueilScreen";
import MarechalerieAccueilScreen from "../screens/achat/sousCategoriesSoinsEtEcuries/MarechalerieAccueilScreen";
import EntrainementAccueilScreen from "../screens/achat/sousCategoriesSoinsEtEcuries/EntrainementAccueilScreen";
import ChienAccueilScreen from "../screens/achat/categories/ChienAccueilScreen";
import TransportAccueilScreen from "../screens/achat/categories/TransportAccueilScreen";
import ValidationScreen from "../screens/vente/ValidationScreen";
import CategoriesAccueilChoiceScreen from "../screens/accueil/CategoriesAcceuilChoiceScreen";
import EtriersAccueilScreen from "../screens/achat/sousCategoriesChevalEtCuir/EtriersAccueilScreen";
import ChevalEtCuirScreen from "../screens/vente/categories/ChevalEtCuirScreen";
import BrideriesScreen from "../screens/vente/sousCategoriesChevalEtCuir/BrideriesScreen";
import MorsScreen from "../screens/vente/sousCategoriesChevalEtCuir/MorsScreen";
import EtriersScreen from "../screens/vente/sousCategoriesChevalEtCuir/EtriersScreen";
import SanglesScreen from "../screens/vente/sousCategoriesChevalEtCuir/SanglesScreen";
import ColiersScreen from "../screens/vente/sousCategoriesChevalEtCuir/ColiersScreen";
import TravailScreen from "../screens/vente/sousCategoriesChevalEtCuir/TravailScreen";
import SelleScreen from "../screens/vente/sousCategoriesChevalEtCuir/SelleScreen";
import ChevalEtTextileScreen from "../screens/vente/categories/ChevalEtTextileScreen";
import ChemisesScreen from "../screens/vente/sousCategoriesChevalEtTextile/ChemisesScreen";
import CouverturesScreen from "../screens/vente/sousCategoriesChevalEtTextile/CouverturesScreen";
import LicolsScreen from "../screens/vente/sousCategoriesChevalEtTextile/LicolsScreen";
import ProtectionsScreen from "../screens/vente/sousCategoriesChevalEtTextile/ProtectionsScreen";
import CavalierScreen from "../screens/vente/categories/CavalierScreen";
import AccessoiresScreen from "../screens/vente/sousCategoriesCavalier/AccessoiresScreen";
import BottesScreen from "../screens/vente/sousCategoriesCavalier/BottesScreen";
import CasquesScreen from "../screens/vente/sousCategoriesCavalier/CasquesScreen";
import EnfantScreen from "../screens/vente/sousCategoriesCavalier/EnfantScreen";
import HommeScreen from "../screens/vente/sousCategoriesCavalier/HommeScreen";
import FemmeScreen from "../screens/vente/sousCategoriesCavalier/FemmeScreen";
import GiletScreen from "../screens/vente/sousCategoriesCavalier/GiletScreen";
import SoinsEtEcuriesScreen from "../screens/vente/categories/SoinsEtEcuriesScreen";
import ProduitsScreen from "../screens/vente/sousCategoriesSoinsEtEcuries/ProduitsScreen";
import MaterielScreen from "../screens/vente/sousCategoriesSoinsEtEcuries/MaterielScreen";
import AlimentsScreen from "../screens/vente/sousCategoriesSoinsEtEcuries/AlimentsScreen";
import TenturesScreen from "../screens/vente/sousCategoriesSoinsEtEcuries/TenturesScreen";
import EquipementsScreen from "../screens/vente/sousCategoriesSoinsEtEcuries/EquipementsScreen";
import ClotureScreen from "../screens/vente/sousCategoriesSoinsEtEcuries/ClotureScreen";
import MarechalerieScreen from "../screens/vente/sousCategoriesSoinsEtEcuries/MarechalerieScreen";
import EntrainementScreen from "../screens/vente/sousCategoriesSoinsEtEcuries/EntrainementScreen";
import ChienScreen from "../screens/vente/categories/ChienScreen";
import TransportScreen from "../screens/vente/categories/TransportScreen";
import AchatScreen from "../screens/achat/AchatScreen";
import ViewProductsScreen from "../screens/achat/ViewProductsScreen";
import ProductDetailScreen from "../screens/achat/ProductDetailScreen";
import CustomHeader from "../components/CustomHeader";
import CartScreen from "../screens/achat/CartScreen";
const AuthStackNavigator = createStackNavigator();
const SellStackNavigator = createStackNavigator();
const AchatStackNavigator = createStackNavigator();
const MessageStackNavigator = createStackNavigator();
const ProfileStackNavigator = createStackNavigator();
const AccueilStackNavigator = createStackNavigator();
import { useDispatch, useSelector } from "react-redux";
import ArticlesEnVenteScreen from "../screens/profile/ArticlesEnVenteScreen";
import BoosteVenteScreen from "../screens/profile/BoosteVenteScreen";
import InformationsScreen from "../screens/profile/InformationsScreen";
import BoosteVentePaiementScreen from "../screens/profile/BoosteVentePaiementScreen";
import ChatScreen from "../screens/messages/ChatScreen";
import SignalerUnLitigeScreen from "../screens/profile/SignalerUnLitigeScreen";
import ModifierAdresseScreen from "../screens/profile/ModifierAdresseScreen";
import ModifierEmailScreen from "../screens/profile/ModifierEmailScreen";
import ModifierPseudoScreen from "../screens/profile/ModifierPseudoScreen";
import ViePriveeScreen from "../screens/profile/ViePriveeScreen";
import CGUScreen from "../screens/profile/CGUScreen";
import MentionLegaleScreen from "../screens/profile/MentionLegaleScreen";
import LivraisonChoiceScreen from "../screens/achat/LivraisonChoiceScreen";
import PortefeuilleScreen from "../screens/profile/PortefeuilleScreen";
import PreInscriptionScreen from "../screens/inscription/PreInscriptionScreen";
import MesCommandesScreen from "../screens/profile/MesCommandesScreen";
import CommandeDetailScreen from "../screens/profile/CommandeDetailScreen";
import EvaluationScreen from "../screens/profile/EvaluationScreen";
import ThankYouScreen from "../screens/achat/ThankYouScreen";
import ValidationEvaluationScreen from "../screens/profile/ValidationEvaluationScreen";
import AvisScreen from "../screens/achat/AvisScreen";
import LivraisonArticleLourdScreen from "../screens/achat/LivraisonArticleLourdScreen";
import PortefeuilleThankYouScreen from "../screens/achat/PortefeuilleThankYouScreen";
import AdresseChoiceScreen from "../screens/achat/AdresseChoiceScreen";
import AdresseValidationScreen from "../screens/achat/AdresseValidationScreen";
import IbanChoiceScreen from "../screens/achat/IBANChoiceScreen";
import ContactScreen from "../screens/profile/ContactScreen";
import ValidationContactScreen from "../screens/profile/ValidationContactScreen";
import ModifierAnnonceScreen from "../screens/profile/ModifierAnnonceScreen";
import ValidationAnnonceModifieeScreen from "../screens/profile/ValidationAnnonceModifieeScreen";
import PhotoModifierAnnonceScreen from "../screens/profile/PhotoModifierAnnonceScreen";
import EnterIbanScreen from "../screens/profile/EnterIbanScreen";
import ValidationIBANScreen from "../screens/profile/ValidationIBANScreen";
import { CommonActions, StackActions } from "@react-navigation/native";
import DeleteAnnonceValidationScreen from "../screens/achat/DeleteAnnonceValidationScreen";
import ForgotPasswordScreen from "../screens/inscription/ForgotPasswordScreen";
import TapisAccueilScreen from "../screens/achat/sousCategoriesChevalEtTextile/TapisAccueilScreen";
import TapisScreen from "../screens/vente/sousCategoriesChevalEtTextile/TapisScreen";
import firebase from "firebase";
import * as messageAction from "../store/actions/messages";
import CommentCaMarcheScreen from "../screens/profile/CommentCaMarcheScreen";
import FirstCartScreen from "../screens/achat/FirstCartScreen";
import ModifierEmailConfirmationScreen from "../screens/profile/ModifierEmailConfirmationScreen";
import PreAuthScreen from "../screens/profile/PreAuthScreen";
import ValidationLitigeScreen from "../screens/profile/ValidationLitigeScreen";
import ModifierOffrePaiementScreen from "../screens/achat/ModifierOffrePaiementScreen";

const AppTabNavigator = createBottomTabNavigator();

export const AuthNavigator = (props) => {
  const {
    loggedInAsVisit,
    setLoggedInAsVisit,
    firstLaunch,
    setFirstLaunch,
    setIsLoggedIn,
  } = props;
  setFirstLaunch(false);
  const classes = {
    header: {
      headerStyle: {
        backgroundColor: "#D51317",
        elevation: 0, // remove shadow on Android
        shadowOpacity: 0,
      },
      headerTitleStyle: {
        color: "black",
      }, // remove shadow on iOS
      title: "",
      headerTitleAlign: "center",
      headerTintColor: "#fff",
      headerBackTitle: "Retour",
    },
  };
  return (
    <AuthStackNavigator.Navigator
      initialRouteName={firstLaunch ? "OnboardingScreen1" : "ConnectionScreen"}
    >
      <AuthStackNavigator.Screen
        name="OnboardingScreen1"
        component={OnboardingScreen1}
        options={{ headerShown: false }}
      />

      <AuthStackNavigator.Screen
        name="OnboardingScreen2"
        component={OnboardingScreen2}
        options={{ headerShown: false }}
      />

      <AuthStackNavigator.Screen
        name="IdentificationScreen"
        children={(props) => (
          <IdentificationScreen
            {...props}
            loggedInAsVisit={loggedInAsVisit}
            setLoggedInAsVisit={setLoggedInAsVisit}
          />
        )}
        options={{ headerShown: false }}
      />
      <AuthStackNavigator.Screen
        name="PreInscriptionScreen"
        component={PreInscriptionScreen}
        options={{ headerShown: false }}
      />
      <AuthStackNavigator.Screen
        name="InscriptionScreen"
        children={(props) => (
          <InscriptionScreen {...props} setIsLoggedIn={setIsLoggedIn} />
        )}
        options={classes.header}
      />
      <AuthStackNavigator.Screen
        name="ForgotPasswordScreen"
        component={ForgotPasswordScreen}
        options={classes.header}
      />
      <AuthStackNavigator.Screen
        name="ConnectionScreen"
        children={(props) => (
          <ConnectionScreen
            {...props}
            loggedInAsVisit={loggedInAsVisit}
            setLoggedInAsVisit={setLoggedInAsVisit}
            setIsLoggedIn={setIsLoggedIn}
          />
        )}
        options={classes.header}
      />
    </AuthStackNavigator.Navigator>
  );
};

export const SellNavigator = () => {
  return (
    <SellStackNavigator.Navigator>
      <SellStackNavigator.Screen
        name="VendreArticleScreen"
        component={VendreArticleScreen}
        options={(props) => ({
          title: props.route.params
            ? props.route.params.modify
              ? "Modification article"
              : "Vendre un article"
            : "Vendre un article",
          headerStyle: {
            backgroundColor: "white",
          },
          headerTitleStyle: {
            color: "black",
          },
          headerBackTitle: "Retour",
          headerBackTitleStyle: {
            color: "black",
          },
          headerTitleAlign: "center",
        })}
      />
      <SellStackNavigator.Screen
        name="PhotoArticleScreen"
        component={PhotoArticleScreen}
        options={{
          title: "Photo",
          headerStyle: {
            backgroundColor: "white",
          },
          headerTitleStyle: {
            color: "black",
          },
          headerBackTitle: "Retour",
          headerBackTitleStyle: {
            color: "black",
          },
          headerTitleAlign: "center",
        }}
      />
      <SellStackNavigator.Screen
        name="MarquesChoiceScreen"
        component={MarquesChoiceScreen}
        options={{
          title: "Marques",
          headerStyle: {
            backgroundColor: "white",
          },
          headerTitleStyle: {
            color: "black",
          },
          headerBackTitle: "Retour",
          headerBackTitleStyle: {
            color: "black",
          },
          headerTitleAlign: "center",
        }}
      />
      <SellStackNavigator.Screen
        name="CategoriesChoiceScreen"
        component={CategoriesChoiceScreen}
        options={{
          title: "Catégories",
          headerStyle: {
            backgroundColor: "white",
          },
          headerTitleStyle: {
            color: "black",
          },
          headerBackTitle: "Retour",
          headerBackTitleStyle: {
            color: "black",
          },
          headerTitleAlign: "center",
        }}
      />
      <SellStackNavigator.Screen
        name="EtatChoiceScreen"
        component={EtatChoiceScreen}
        options={{
          title: "Etat",
          headerStyle: {
            backgroundColor: "white",
          },
          headerTitleStyle: {
            color: "black",
          },
          headerBackTitle: "Retour",
          headerBackTitleStyle: {
            color: "black",
          },
          headerTitleAlign: "center",
        }}
      />
      <SellStackNavigator.Screen
        name="ChevalEtCuirScreen"
        component={ChevalEtCuirScreen}
        options={{
          title: "Cheval & Cuir",
          headerStyle: {
            backgroundColor: "white",
          },
          headerTitleStyle: {
            color: "black",
          },
          headerBackTitle: "Retour",
          headerBackTitleStyle: {
            color: "black",
          },
          headerTitleAlign: "center",
        }}
      />
      <SellStackNavigator.Screen
        name="BrideriesScreen"
        component={BrideriesScreen}
        options={{
          title: "Brideries rênes et accessoires",
          headerStyle: {
            backgroundColor: "white",
          },
          headerTitleStyle: {
            color: "black",
          },
          headerBackTitle: "Retour",
          headerBackTitleStyle: {
            color: "black",
          },
          headerTitleAlign: "center",
        }}
      />
      <SellStackNavigator.Screen
        name="MorsScreen"
        component={MorsScreen}
        options={{
          title: "Mors",
          headerStyle: {
            backgroundColor: "white",
          },
          headerTitleStyle: {
            color: "black",
          },
          headerBackTitle: "Retour",
          headerBackTitleStyle: {
            color: "black",
          },
          headerTitleAlign: "center",
        }}
      />
      <SellStackNavigator.Screen
        name="EtriersScreen"
        component={EtriersScreen}
        options={{
          title: "Etriers et étrivières",
          headerStyle: {
            backgroundColor: "white",
          },
          headerTitleStyle: {
            color: "black",
          },
          headerBackTitle: "Retour",
          headerBackTitleStyle: {
            color: "black",
          },
          headerTitleAlign: "center",
        }}
      />
      <SellStackNavigator.Screen
        name="SanglesScreen"
        component={SanglesScreen}
        options={{
          title: "Sangles et bavettes",
          headerStyle: {
            backgroundColor: "white",
          },
          headerTitleStyle: {
            color: "black",
          },
          headerBackTitle: "Retour",
          headerBackTitleStyle: {
            color: "black",
          },
          headerTitleAlign: "center",
        }}
      />
      <SellStackNavigator.Screen
        name="ColiersScreen"
        component={ColiersScreen}
        options={{
          title: "Colliers de chasses et enrênements",
          headerStyle: {
            backgroundColor: "white",
          },
          headerTitleStyle: {
            color: "black",
          },
          headerBackTitle: "Retour",
          headerBackTitleStyle: {
            color: "black",
          },
          headerTitleAlign: "center",
        }}
      />
      <SellStackNavigator.Screen
        name="TravailScreen"
        component={TravailScreen}
        options={{
          title: "Travail à pied",
          headerStyle: {
            backgroundColor: "white",
          },
          headerTitleStyle: {
            color: "black",
          },
          headerBackTitle: "Retour",
          headerBackTitleStyle: {
            color: "black",
          },
          headerTitleAlign: "center",
        }}
      />
      <SellStackNavigator.Screen
        name="SelleScreen"
        component={SelleScreen}
        options={{
          title: "Selles et accessoires",
          headerStyle: {
            backgroundColor: "white",
          },
          headerTitleStyle: {
            color: "black",
          },
          headerBackTitle: "Retour",
          headerBackTitleStyle: {
            color: "black",
          },
          headerTitleAlign: "center",
        }}
      />
      <SellStackNavigator.Screen
        name="ChevalEtTextileScreen"
        component={ChevalEtTextileScreen}
        options={{
          title: "Cheval & Textile",
          headerStyle: {
            backgroundColor: "white",
          },
          headerTitleStyle: {
            color: "black",
          },
          headerBackTitle: "Retour",
          headerBackTitleStyle: {
            color: "black",
          },
          headerTitleAlign: "center",
        }}
      />
      <SellStackNavigator.Screen
        name="ChemisesScreen"
        component={ChemisesScreen}
        options={{
          title: "Chemises et séchantes",
          headerStyle: {
            backgroundColor: "white",
          },
          headerTitleStyle: {
            color: "black",
          },
          headerBackTitle: "Retour",
          headerBackTitleStyle: {
            color: "black",
          },
          headerTitleAlign: "center",
        }}
      />
      <SellStackNavigator.Screen
        name="CouverturesScreen"
        component={CouverturesScreen}
        options={{
          title: "Couvertures et couvre-reins",
          headerStyle: {
            backgroundColor: "white",
          },
          headerTitleStyle: {
            color: "black",
          },
          headerBackTitle: "Retour",
          headerBackTitleStyle: {
            color: "black",
          },
          headerTitleAlign: "center",
        }}
      />
      <SellStackNavigator.Screen
        name="LicolsScreen"
        component={LicolsScreen}
        options={{
          title: "Licols et longes",
          headerStyle: {
            backgroundColor: "white",
          },
          headerTitleStyle: {
            color: "black",
          },
          headerBackTitle: "Retour",
          headerBackTitleStyle: {
            color: "black",
          },
          headerTitleAlign: "center",
        }}
      />
      <SellStackNavigator.Screen
        name="ProtectionsScreen"
        component={ProtectionsScreen}
        options={{
          title: "Protections des membres",
          headerStyle: {
            backgroundColor: "white",
          },
          headerTitleStyle: {
            color: "black",
          },
          headerBackTitle: "Retour",
          headerBackTitleStyle: {
            color: "black",
          },
          headerTitleAlign: "center",
        }}
      />
      <SellStackNavigator.Screen
        name="TapisScreen"
        component={TapisScreen}
        options={{
          title: "Tapis, bonnets et amortisseurs",
          headerStyle: {
            backgroundColor: "white",
          },
          headerTitleStyle: {
            color: "black",
          },
          headerBackTitle: "Retour",
          headerBackTitleStyle: {
            color: "black",
          },
          headerTitleAlign: "center",
        }}
      />
      <SellStackNavigator.Screen
        name="CavalierScreen"
        component={CavalierScreen}
        options={{
          title: "Cavaliers",
          headerStyle: {
            backgroundColor: "white",
          },
          headerTitleStyle: {
            color: "black",
          },
          headerBackTitle: "Retour",
          headerBackTitleStyle: {
            color: "black",
          },
          headerTitleAlign: "center",
        }}
      />
      <SellStackNavigator.Screen
        name="AccessoiresScreen"
        component={AccessoiresScreen}
        options={{
          title: "Accessoires",
          headerStyle: {
            backgroundColor: "white",
          },
          headerTitleStyle: {
            color: "black",
          },
          headerBackTitle: "Retour",
          headerBackTitleStyle: {
            color: "black",
          },
          headerTitleAlign: "center",
        }}
      />
      <SellStackNavigator.Screen
        name="BottesScreen"
        component={BottesScreen}
        options={{
          title: "Bottes, boots et mini-chaps",
          headerStyle: {
            backgroundColor: "white",
          },
          headerTitleStyle: {
            color: "black",
          },
          headerBackTitle: "Retour",
          headerBackTitleStyle: {
            color: "black",
          },
          headerTitleAlign: "center",
        }}
      />
      <SellStackNavigator.Screen
        name="CasquesScreen"
        component={CasquesScreen}
        options={{
          title: "Casques d’équitation",
          headerStyle: {
            backgroundColor: "white",
          },
          headerTitleStyle: {
            color: "black",
          },
          headerBackTitle: "Retour",
          headerBackTitleStyle: {
            color: "black",
          },
          headerTitleAlign: "center",
        }}
      />
      <SellStackNavigator.Screen
        name="EnfantScreen"
        component={EnfantScreen}
        options={{
          title: "Prêt-à-porter enfant",
          headerStyle: {
            backgroundColor: "white",
          },
          headerTitleStyle: {
            color: "black",
          },
          headerBackTitle: "Retour",
          headerBackTitleStyle: {
            color: "black",
          },
          headerTitleAlign: "center",
        }}
      />
      <SellStackNavigator.Screen
        name="HommeScreen"
        component={HommeScreen}
        options={{
          title: "Prêt-à-porter homme",
          headerStyle: {
            backgroundColor: "white",
          },
          headerTitleStyle: {
            color: "black",
          },
          headerBackTitle: "Retour",
          headerBackTitleStyle: {
            color: "black",
          },
          headerTitleAlign: "center",
        }}
      />
      <SellStackNavigator.Screen
        name="FemmeScreen"
        component={FemmeScreen}
        options={{
          title: "Prêt-à-porter femme",
          headerStyle: {
            backgroundColor: "white",
          },
          headerTitleStyle: {
            color: "black",
          },
          headerBackTitle: "Retour",
          headerBackTitleStyle: {
            color: "black",
          },
          headerTitleAlign: "center",
        }}
      />
      <SellStackNavigator.Screen
        name="GiletScreen"
        component={GiletScreen}
        options={{
          title: "Gilets de protection",
          headerStyle: {
            backgroundColor: "white",
          },
          headerTitleStyle: {
            color: "black",
          },
          headerBackTitle: "Retour",
          headerBackTitleStyle: {
            color: "black",
          },
          headerTitleAlign: "center",
        }}
      />
      <SellStackNavigator.Screen
        name="SoinsEtEcuriesScreen"
        component={SoinsEtEcuriesScreen}
        options={{
          title: "Soins et écuries",
          headerStyle: {
            backgroundColor: "white",
          },
          headerTitleStyle: {
            color: "black",
          },
          headerBackTitle: "Retour",
          headerBackTitleStyle: {
            color: "black",
          },
          headerTitleAlign: "center",
        }}
      />
      <SellStackNavigator.Screen
        name="AlimentsScreen"
        component={AlimentsScreen}
        options={{
          title: "Aliments",
          headerStyle: {
            backgroundColor: "white",
          },
          headerTitleStyle: {
            color: "black",
          },
          headerBackTitle: "Retour",
          headerBackTitleStyle: {
            color: "black",
          },
          headerTitleAlign: "center",
        }}
      />
      <SellStackNavigator.Screen
        name="ProduitsScreen"
        component={ProduitsScreen}
        options={{
          title: "Produits d'entretien",
          headerStyle: {
            backgroundColor: "white",
          },
          headerTitleStyle: {
            color: "black",
          },
          headerBackTitle: "Retour",
          headerBackTitleStyle: {
            color: "black",
          },
          headerTitleAlign: "center",
        }}
      />
      <SellStackNavigator.Screen
        name="MaterielScreen"
        component={MaterielScreen}
        options={{
          title: "Matériel de pansage",
          headerStyle: {
            backgroundColor: "white",
          },
          headerTitleStyle: {
            color: "black",
          },
          headerBackTitle: "Retour",
          headerBackTitleStyle: {
            color: "black",
          },
          headerTitleAlign: "center",
        }}
      />
      <SellStackNavigator.Screen
        name="TenturesScreen"
        component={TenturesScreen}
        options={{
          title: "Tentures, housses",
          headerStyle: {
            backgroundColor: "white",
          },
          headerTitleStyle: {
            color: "black",
          },
          headerBackTitle: "Retour",
          headerBackTitleStyle: {
            color: "black",
          },
          headerTitleAlign: "center",
        }}
      />
      <SellStackNavigator.Screen
        name="EquipementsScreen"
        component={EquipementsScreen}
        options={{
          title: "Equipements box",
          headerStyle: {
            backgroundColor: "white",
          },
          headerTitleStyle: {
            color: "black",
          },
          headerBackTitle: "Retour",
          headerBackTitleStyle: {
            color: "black",
          },
          headerTitleAlign: "center",
        }}
      />
      <SellStackNavigator.Screen
        name="ClotureScreen"
        component={ClotureScreen}
        options={{
          title: "Matériels de clôture",
          headerStyle: {
            backgroundColor: "white",
          },
          headerTitleStyle: {
            color: "black",
          },
          headerBackTitle: "Retour",
          headerBackTitleStyle: {
            color: "black",
          },
          headerTitleAlign: "center",
        }}
      />
      <SellStackNavigator.Screen
        name="MarechalerieScreen"
        component={MarechalerieScreen}
        options={{
          title: "Maréchalerie",
          headerStyle: {
            backgroundColor: "white",
          },
          headerTitleStyle: {
            color: "black",
          },
          headerBackTitle: "Retour",
          headerBackTitleStyle: {
            color: "black",
          },
          headerTitleAlign: "center",
        }}
      />
      <SellStackNavigator.Screen
        name="EntrainementScreen"
        component={EntrainementScreen}
        options={{
          title: "Matériels d’entrainement",
          headerStyle: {
            backgroundColor: "white",
          },
          headerTitleStyle: {
            color: "black",
          },
          headerBackTitle: "Retour",
          headerBackTitleStyle: {
            color: "black",
          },
          headerTitleAlign: "center",
        }}
      />
      <SellStackNavigator.Screen
        name="ChienScreen"
        component={ChienScreen}
        options={{
          title: "Chiens et autres animaux",
          headerStyle: {
            backgroundColor: "white",
          },
          headerTitleStyle: {
            color: "black",
          },
          headerBackTitle: "Retour",
          headerBackTitleStyle: {
            color: "black",
          },
          headerTitleAlign: "center",
        }}
      />
      <SellStackNavigator.Screen
        name="TransportScreen"
        component={TransportScreen}
        options={{
          title: "Transport",
          headerStyle: {
            backgroundColor: "white",
          },
          headerTitleStyle: {
            color: "black",
          },
          headerBackTitle: "Retour",
          headerBackTitleStyle: {
            color: "black",
          },
          headerTitleAlign: "center",
        }}
      />
      <SellStackNavigator.Screen
        name="ValidationScreen"
        component={ValidationScreen}
        options={{ headerShown: false }}
      />
    </SellStackNavigator.Navigator>
  );
};

export const AchatNavigator = (props) => {
  const { loggedInAsVisit, setLoggedInAsVisit } = props;

  let totalQuantity = 0;
  const cartItems = useSelector((state) => {
    const transformedCartItems = [];
    for (const key in state.cart.items) {
      transformedCartItems.push({
        productId: key,
        productTitle: state.cart.items[key].productTitle,
        productPrice: state.cart.items[key].productPrice,
        quantity: state.cart.items[key].quantity,
        sum: state.cart.items[key].sum,
      });
    }
    return transformedCartItems;
  });

  for (let data in cartItems) {
    totalQuantity += parseFloat(cartItems[data].quantity);
  }
  console.log("totalQuantity", totalQuantity);
  console.log("cartItems", cartItems);
  return (
    <AchatStackNavigator.Navigator>
      <AchatStackNavigator.Screen
        name="AchatScreen"
        component={AchatScreen}
        options={{
          headerRightContainerStyle: {
            paddingRight: 10,
          },
          headerBackTitle: "Retour",
          headerLeftContainerStyle: {
            paddingLeft: 10,
          },
          headerRight: () => (
            <View>
              <View
                style={{
                  backgroundColor: "#D51317",
                  borderRadius: 30,
                  alignItems: "center",
                  position: "absolute",
                  width: 20,
                  bottom: "65%",
                  right: "55%",
                }}
              >
                <Text style={{ color: "white", fontWeight: "bold" }}>
                  {totalQuantity}
                </Text>
              </View>
              <Fontisto
                name="shopping-basket"
                size={24}
                color="#D51317"
                onPress={() => props.navigation.navigate("FirstCartScreen")}
              />
            </View>
          ),
          headerTitle: () => <CustomHeader {...props} />,
        }}
      />
      <AchatStackNavigator.Screen
        name="CategoriesAcceuilChoiceScreen"
        component={CategoriesAccueilChoiceScreen}
        options={{
          title: "Catégories",
          headerStyle: {
            backgroundColor: "white",
          },
          headerTitleStyle: {
            color: "black",
          },
          headerBackTitle: "Retour",
          headerBackTitleStyle: {
            color: "black",
          },
          headerTitleAlign: "center",
        }}
      />
        <AchatStackNavigator.Screen
            name="ModifierOffrePaiementScreen"
            component={ModifierOffrePaiementScreen}
            options={{
                title: "Paiement",
                headerStyle: {
                    backgroundColor: "white",
                },
                headerTitleStyle: {
                    color: "black",
                },
                headerBackTitle: "Retour",
                headerBackTitleStyle: {
                    color: "black",
                },
                headerTitleAlign: "center",
            }}
        />
        <AchatStackNavigator.Screen
            name="DeleteAnnonceValidationScreen"
            component={DeleteAnnonceValidationScreen}
            options={{
                headerShown: false,
            }}
        />
      <AchatStackNavigator.Screen
        name="DeleteAnnonceValidationScreen"
        component={DeleteAnnonceValidationScreen}
        options={{
          headerShown: false,
        }}
      />
      <AchatStackNavigator.Screen
        name="AdresseChoiceScreen"
        component={AdresseChoiceScreen}
        options={{
          title: "Adresse",
          headerStyle: {
            backgroundColor: "white",
          },
          headerTitleStyle: {
            color: "black",
          },
          headerBackTitle: "Retour",
          headerBackTitleStyle: {
            color: "black",
          },
          headerTitleAlign: "center",
        }}
      />
      <AchatStackNavigator.Screen
        name="AdresseValidationScreen"
        component={AdresseValidationScreen}
        options={{
          headerShown: false,
        }}
      />
      <AchatStackNavigator.Screen
        name="IBANChoiceScreen"
        component={IbanChoiceScreen}
        options={{
          title: "IBAN",
          headerStyle: {
            backgroundColor: "white",
          },
          headerTitleStyle: {
            color: "black",
          },
          headerBackTitle: "Retour",
          headerBackTitleStyle: {
            color: "black",
          },
          headerTitleAlign: "center",
        }}
      />
      <AchatStackNavigator.Screen
        name="ThankYouScreen"
        component={ThankYouScreen}
        options={{
          headerShown: false,
        }}
      />
      <AchatStackNavigator.Screen
        name="CavalierAccueilScreen"
        component={CavalierAccueilScreen}
        options={{
          title: "Cavalier",
          headerStyle: {
            backgroundColor: "white",
          },
          headerTitleStyle: {
            color: "black",
          },
          headerBackTitle: "Retour",
          headerBackTitleStyle: {
            color: "black",
          },
          headerTitleAlign: "center",
        }}
      />
      <AchatStackNavigator.Screen
        name="TapisAccueilScreen"
        component={TapisAccueilScreen}
        options={{
          title: "Tapis",
          headerStyle: {
            backgroundColor: "white",
          },
          headerTitleStyle: {
            color: "black",
          },
          headerBackTitle: "Retour",
          headerBackTitleStyle: {
            color: "black",
          },
          headerTitleAlign: "center",
        }}
      />
      <AchatStackNavigator.Screen
        name="AvisScreen"
        component={AvisScreen}
        options={{
          title: "Avis",
          headerStyle: {
            backgroundColor: "white",
          },
          headerTitleStyle: {
            color: "black",
          },
          headerBackTitle: "Retour",
          headerBackTitleStyle: {
            color: "black",
          },
          headerTitleAlign: "center",
        }}
      />
      <AchatStackNavigator.Screen
        name="ChevalEtCuirAccueilScreen"
        component={ChevalEtCuirAccueilScreen}
        options={{
          title: "Cheval & Cuir",
          headerStyle: {
            backgroundColor: "white",
          },
          headerTitleStyle: {
            color: "black",
          },
          headerBackTitle: "Retour",
          headerBackTitleStyle: {
            color: "black",
          },
          headerTitleAlign: "center",
        }}
      />
      <AchatStackNavigator.Screen
        name="ChevalEtTextileAccueilScreen"
        component={ChevalEtTextileAccueilScreen}
        options={{
          title: "Cheval & Textile",
          headerStyle: {
            backgroundColor: "white",
          },
          headerTitleStyle: {
            color: "black",
          },
          headerBackTitle: "Retour",
          headerBackTitleStyle: {
            color: "black",
          },
          headerTitleAlign: "center",
        }}
      />
      <AchatStackNavigator.Screen
        name="ChienAccueilScreen"
        component={ChienAccueilScreen}
        options={{
          title: "Chien & Animaux",
          headerStyle: {
            backgroundColor: "white",
          },
          headerTitleStyle: {
            color: "black",
          },
          headerBackTitle: "Retour",
          headerBackTitleStyle: {
            color: "black",
          },
          headerTitleAlign: "center",
        }}
      />
      <AchatStackNavigator.Screen
        name="SoinsEtEcuriesAccueilScreen"
        component={SoinsEtEcuriesAccueilScreen}
        options={{
          title: "Soins & Ecuries",
          headerStyle: {
            backgroundColor: "white",
          },
          headerTitleStyle: {
            color: "black",
          },
          headerBackTitle: "Retour",
          headerBackTitleStyle: {
            color: "black",
          },
          headerTitleAlign: "center",
        }}
      />
      <AchatStackNavigator.Screen
        name="TransportAccueilScreen"
        component={TransportAccueilScreen}
        options={{
          title: "Transport",
          headerStyle: {
            backgroundColor: "white",
          },
          headerTitleStyle: {
            color: "black",
          },
          headerBackTitle: "Retour",
          headerBackTitleStyle: {
            color: "black",
          },
          headerTitleAlign: "center",
        }}
      />
      <AchatStackNavigator.Screen
        name="AccessoiresAccueilScreen"
        component={AccessoiresAccueilScreen}
        options={{
          title: "Accessoires",
          headerStyle: {
            backgroundColor: "white",
          },
          headerTitleStyle: {
            color: "black",
          },
          headerBackTitle: "Retour",
          headerBackTitleStyle: {
            color: "black",
          },
          headerTitleAlign: "center",
        }}
      />
      <AchatStackNavigator.Screen
        name="BottesAccueilScreen"
        component={BottesAccueilScreen}
        options={{
          title: "Bottes",
          headerStyle: {
            backgroundColor: "white",
          },
          headerTitleStyle: {
            color: "black",
          },
          headerBackTitle: "Retour",
          headerBackTitleStyle: {
            color: "black",
          },
          headerTitleAlign: "center",
        }}
      />
      <AchatStackNavigator.Screen
        name="CasquesAccueilScreen"
        component={CasquesAccueilScreen}
        options={{
          title: "Casques",
          headerStyle: {
            backgroundColor: "white",
          },
          headerTitleStyle: {
            color: "black",
          },
          headerBackTitle: "Retour",
          headerBackTitleStyle: {
            color: "black",
          },
          headerTitleAlign: "center",
        }}
      />
      <AchatStackNavigator.Screen
        name="EnfantAccueilScreen"
        component={EnfantAccueilScreen}
        options={{
          title: "Enfant",
          headerStyle: {
            backgroundColor: "white",
          },
          headerTitleStyle: {
            color: "black",
          },
          headerBackTitle: "Retour",
          headerBackTitleStyle: {
            color: "black",
          },
          headerTitleAlign: "center",
        }}
      />
      <AchatStackNavigator.Screen
        name="FemmeAccueilScreen"
        component={FemmeAccueilScreen}
        options={{
          title: "Femme",
          headerStyle: {
            backgroundColor: "white",
          },
          headerTitleStyle: {
            color: "black",
          },
          headerBackTitle: "Retour",
          headerBackTitleStyle: {
            color: "black",
          },
          headerTitleAlign: "center",
        }}
      />
      <AchatStackNavigator.Screen
        name="GiletAccueilScreen"
        component={GiletAccueilScreen}
        options={{
          title: "Gilet",
          headerStyle: {
            backgroundColor: "white",
          },
          headerTitleStyle: {
            color: "black",
          },
          headerBackTitle: "Retour",
          headerBackTitleStyle: {
            color: "black",
          },
          headerTitleAlign: "center",
        }}
      />
      <AchatStackNavigator.Screen
        name="HommeAccueilScreen"
        component={HommeAccueilScreen}
        options={{
          title: "Homme",
          headerStyle: {
            backgroundColor: "white",
          },
          headerTitleStyle: {
            color: "black",
          },
          headerBackTitle: "Retour",
          headerBackTitleStyle: {
            color: "black",
          },
          headerTitleAlign: "center",
        }}
      />
      <AchatStackNavigator.Screen
        name="BrideriesAccueilScreen"
        component={BrideriesAccueilScreen}
        options={{
          title: "Brideries",
          headerStyle: {
            backgroundColor: "white",
          },
          headerTitleStyle: {
            color: "black",
          },
          headerBackTitle: "Retour",
          headerBackTitleStyle: {
            color: "black",
          },
          headerTitleAlign: "center",
        }}
      />
      <AchatStackNavigator.Screen
        name="ColiersAccueilScreen"
        component={ColiersAccueilScreen}
        options={{
          title: "Colliers",
          headerStyle: {
            backgroundColor: "white",
          },
          headerTitleStyle: {
            color: "black",
          },
          headerBackTitle: "Retour",
          headerBackTitleStyle: {
            color: "black",
          },
          headerTitleAlign: "center",
        }}
      />
      <AchatStackNavigator.Screen
        name="EtriersAccueilScreen"
        component={EtriersAccueilScreen}
        options={{
          title: "Etriers",
          headerStyle: {
            backgroundColor: "white",
          },
          headerTitleStyle: {
            color: "black",
          },
          headerBackTitle: "Retour",
          headerBackTitleStyle: {
            color: "black",
          },
          headerTitleAlign: "center",
        }}
      />
      <AchatStackNavigator.Screen
        name="MorsAccueilScreen"
        component={MorsAccueilScreen}
        options={{
          title: "Mors",
          headerStyle: {
            backgroundColor: "white",
          },
          headerTitleStyle: {
            color: "black",
          },
          headerBackTitle: "Retour",
          headerBackTitleStyle: {
            color: "black",
          },
          headerTitleAlign: "center",
        }}
      />
      <AchatStackNavigator.Screen
        name="SanglesAccueilScreen"
        component={SanglesAccueilScreen}
        options={{
          title: "Sangles",
          headerStyle: {
            backgroundColor: "white",
          },
          headerTitleStyle: {
            color: "black",
          },
          headerBackTitle: "Retour",
          headerBackTitleStyle: {
            color: "black",
          },
          headerTitleAlign: "center",
        }}
      />
      <AchatStackNavigator.Screen
        name="SelleAccueilScreen"
        component={SelleAccueilScreen}
        options={{
          title: "Selles",
          headerStyle: {
            backgroundColor: "white",
          },
          headerTitleStyle: {
            color: "black",
          },
          headerBackTitle: "Retour",
          headerBackTitleStyle: {
            color: "black",
          },
          headerTitleAlign: "center",
        }}
      />
      <AchatStackNavigator.Screen
        name="TravailAccueilScreen"
        component={TravailAccueilScreen}
        options={{
          title: "Travail à pied",
          headerStyle: {
            backgroundColor: "white",
          },
          headerTitleStyle: {
            color: "black",
          },
          headerBackTitle: "Retour",
          headerBackTitleStyle: {
            color: "black",
          },
          headerTitleAlign: "center",
        }}
      />
      <AchatStackNavigator.Screen
        name="ChemisesAccueilScreen"
        component={ChemisesAccueilScreen}
        options={{
          title: "Chemises & séchantes",
          headerStyle: {
            backgroundColor: "white",
          },
          headerTitleStyle: {
            color: "black",
          },
          headerBackTitle: "Retour",
          headerBackTitleStyle: {
            color: "black",
          },
          headerTitleAlign: "center",
        }}
      />
      <AchatStackNavigator.Screen
        name="CouverturesAccueilScreen"
        component={CouverturesAccueilScreen}
        options={{
          title: "Couvertures",
          headerStyle: {
            backgroundColor: "white",
          },
          headerTitleStyle: {
            color: "black",
          },
          headerBackTitle: "Retour",
          headerBackTitleStyle: {
            color: "black",
          },
          headerTitleAlign: "center",
        }}
      />
      <AchatStackNavigator.Screen
        name="LicolsAccueilScreen"
        component={LicolsAccueilScreen}
        options={{
          title: "Licols",
          headerStyle: {
            backgroundColor: "white",
          },
          headerTitleStyle: {
            color: "black",
          },
          headerBackTitle: "Retour",
          headerBackTitleStyle: {
            color: "black",
          },
          headerTitleAlign: "center",
        }}
      />
      <AchatStackNavigator.Screen
        name="ProtectionsAccueilScreen"
        component={ProtectionsAccueilScreen}
        options={{
          title: "Protections",
          headerStyle: {
            backgroundColor: "white",
          },
          headerTitleStyle: {
            color: "black",
          },
          headerBackTitle: "Retour",
          headerBackTitleStyle: {
            color: "black",
          },
          headerTitleAlign: "center",
        }}
      />
      <AchatStackNavigator.Screen
        name="AlimentsAccueilScreen"
        component={AlimentsAccueilScreen}
        options={{
          title: "Aliments",
          headerStyle: {
            backgroundColor: "white",
          },
          headerTitleStyle: {
            color: "black",
          },
          headerBackTitle: "Retour",
          headerBackTitleStyle: {
            color: "black",
          },
          headerTitleAlign: "center",
        }}
      />
      <AchatStackNavigator.Screen
        name="ClotureAccueilScreen"
        component={ClotureAccueilScreen}
        options={{
          title: "Clôtures",
          headerStyle: {
            backgroundColor: "white",
          },
          headerTitleStyle: {
            color: "black",
          },
          headerBackTitle: "Retour",
          headerBackTitleStyle: {
            color: "black",
          },
          headerTitleAlign: "center",
        }}
      />
      <AchatStackNavigator.Screen
        name="EntrainementAccueilScreen"
        component={EntrainementAccueilScreen}
        options={{
          title: "Entraînements",
          headerStyle: {
            backgroundColor: "white",
          },
          headerTitleStyle: {
            color: "black",
          },
          headerBackTitle: "Retour",
          headerBackTitleStyle: {
            color: "black",
          },
          headerTitleAlign: "center",
        }}
      />
      <AchatStackNavigator.Screen
        name="EquipementsAccueilScreen"
        component={EquipementsAccueilScreen}
        options={{
          title: "Equipements",
          headerStyle: {
            backgroundColor: "white",
          },
          headerTitleStyle: {
            color: "black",
          },
          headerBackTitle: "Retour",
          headerBackTitleStyle: {
            color: "black",
          },
          headerTitleAlign: "center",
        }}
      />
      <AchatStackNavigator.Screen
        name="MarechalerieAccueilScreen"
        component={MarechalerieAccueilScreen}
        options={{
          title: "Maréchalerie",
          headerStyle: {
            backgroundColor: "white",
          },
          headerTitleStyle: {
            color: "black",
          },
          headerBackTitle: "Retour",
          headerBackTitleStyle: {
            color: "black",
          },
          headerTitleAlign: "center",
        }}
      />
      <AchatStackNavigator.Screen
        name="MaterielAccueilScreen"
        component={MaterielAccueilScreen}
        options={{
          title: "Matériels",
          headerStyle: {
            backgroundColor: "white",
          },
          headerTitleStyle: {
            color: "black",
          },
          headerBackTitle: "Retour",
          headerBackTitleStyle: {
            color: "black",
          },
          headerTitleAlign: "center",
        }}
      />
      <AchatStackNavigator.Screen
        name="ProduitsAccueilScreen"
        component={ProduitsAccueilScreen}
        options={{
          title: "Produits",
          headerStyle: {
            backgroundColor: "white",
          },
          headerTitleStyle: {
            color: "black",
          },
          headerBackTitle: "Retour",
          headerBackTitleStyle: {
            color: "black",
          },
          headerTitleAlign: "center",
        }}
      />
      <AchatStackNavigator.Screen
        name="TenturesAccueilScreen"
        component={TenturesAccueilScreen}
        options={{
          title: "Tentures",
          headerStyle: {
            backgroundColor: "white",
          },
          headerTitleStyle: {
            color: "black",
          },
          headerBackTitle: "Retour",
          headerBackTitleStyle: {
            color: "black",
          },
          headerTitleAlign: "center",
        }}
      />
      <AchatStackNavigator.Screen
        name="ViewProductsScreen"
        component={ViewProductsScreen}
        options={{
          headerRightContainerStyle: {
            paddingRight: 10,
          },
          headerBackTitle: "Retour",
          headerLeftContainerStyle: {
            paddingLeft: 10,
          },
          headerRight: () => (
            <View>
              <View
                style={{
                  backgroundColor: "#D51317",
                  borderRadius: 30,
                  alignItems: "center",
                  position: "absolute",
                  width: 20,
                  bottom: "65%",
                  right: "55%",
                }}
              >
                <Text style={{ color: "white", fontWeight: "bold" }}>
                  {totalQuantity}
                </Text>
              </View>
              <Fontisto
                name="shopping-basket"
                size={24}
                color="#D51317"
                onPress={() => props.navigation.navigate("FirstCartScreen")}
              />
            </View>
          ),
          headerTitle: () => (
            <View style={{ width: 180, marginLeft: 40 }}>
              <CustomHeader {...props} />
            </View>
          ),
        }}
      />
      <AchatStackNavigator.Screen
        name="PhotoArticleScreen"
        component={PhotoArticleScreen}
        options={{
          title: "Photo",
          headerStyle: {
            backgroundColor: "white",
          },
          headerTitleStyle: {
            color: "black",
          },
          headerBackTitle: "Retour",
          headerBackTitleStyle: {
            color: "black",
          },
          headerTitleAlign: "center",
        }}
      />
      <AchatStackNavigator.Screen
        name="ProductDetailScreen"
        component={ProductDetailScreen}
        options={{
          headerRightContainerStyle: {
            paddingRight: 10,
          },
          headerLeftContainerStyle: {
            paddingLeft: 10,
          },
          headerBackTitle: "Retour",
          headerRight: () => (
            <View>
              <View
                style={{
                  backgroundColor: "#D51317",
                  borderRadius: 30,
                  alignItems: "center",
                  position: "absolute",
                  width: 20,
                  bottom: "65%",
                  right: "55%",
                }}
              >
                <Text style={{ color: "white", fontWeight: "bold" }}>
                  {totalQuantity}
                </Text>
              </View>
              <Fontisto
                name="shopping-basket"
                size={24}
                color="#D51317"
                onPress={() => props.navigation.navigate("FirstCartScreen")}
              />
            </View>
          ),
          headerTitle: "Details",
        }}
      />
      <AchatStackNavigator.Screen
        name="LivraisonArticleLourdScreen"
        component={LivraisonArticleLourdScreen}
        options={{
          headerRightContainerStyle: {
            paddingRight: 10,
          },
          headerBackTitle: "Retour",
          headerLeftContainerStyle: {
            paddingLeft: 10,
          },
          headerTitle: "Livraison Lourde",
        }}
      />
      <AchatStackNavigator.Screen
        name="PortefeuilleThankYouScreen"
        component={PortefeuilleThankYouScreen}
        options={{
          headerShown: false,
        }}
      />
      <AchatStackNavigator.Screen
        name="CartScreen"
        children={(props) => (
          <CartScreen
            {...props}
            loggedInAsVisit={loggedInAsVisit}
            setLoggedInAsVisit={setLoggedInAsVisit}
          />
        )}
        options={{
          headerLeftContainerStyle: {
            paddingLeft: 10,
          },
          headerBackTitle: "Retour",
          headerTitle: "Panier",
          headerTitleStyle: {
            textAlign: "center",
          },
        }}
      />
      <AchatStackNavigator.Screen
        name="FirstCartScreen"
        children={(props) => (
          <FirstCartScreen
            {...props}
            loggedInAsVisit={loggedInAsVisit}
            setLoggedInAsVisit={setLoggedInAsVisit}
          />
        )}
        options={{
          headerLeftContainerStyle: {
            paddingLeft: 10,
          },
          headerBackTitle: "Retour",
          headerTitle: "Panier",
          headerTitleStyle: {
            textAlign: "center",
          },
        }}
      />
      <AchatStackNavigator.Screen
        name="LivraisonChoiceScreen"
        component={LivraisonChoiceScreen}
        options={{
          headerLeftContainerStyle: {
            paddingLeft: 10,
          },
          headerBackTitle: "Retour",
          headerTitle: "Livraison",
        }}
      />
    </AchatStackNavigator.Navigator>
  );
};

export const MessageNavigator = (props) => {
  return (
    <MessageStackNavigator.Navigator>
      <MessageStackNavigator.Screen
        name="MessageScreen"
        component={MessageScreen}
        options={{
          headerRightContainerStyle: {
            paddingRight: 10,
          },

          headerLeftContainerStyle: {
            paddingLeft: 10,
          },
          headerTitle: "Messages",
          headerTitleAlign: "center",
        }}
      />
      <MessageStackNavigator.Screen
        name="ChatScreen"
        component={ChatScreen}
        options={{
          headerRightContainerStyle: {
            paddingRight: 10,
          },
          headerLeftContainerStyle: {
            paddingLeft: 10,
          },
          headerBackTitle: "Retour",
          headerTitle: "Messages",
          headerTitleAlign: "center",
        }}
      />

      <MessageStackNavigator.Screen
        name="ArticlesEnVenteScreen"
        component={ArticlesEnVenteScreen}
        options={{
          headerRightContainerStyle: {
            paddingRight: 10,
          },
          headerLeftContainerStyle: {
            paddingLeft: 10,
          },
          headerBackTitle: "Retour",
          headerTitle: "Articles en Vente",
          headerTitleAlign: "center",
        }}
      />
    </MessageStackNavigator.Navigator>
  );
};

export const ProfileNavigator = (props) => {
  return (
    <ProfileStackNavigator.Navigator>
      <ProfileStackNavigator.Screen
        name="ProfileScreen"
        component={ProfileScreen}
        options={{
          headerRightContainerStyle: {
            paddingRight: 10,
          },
          headerBackTitle: "Retour",
          headerLeftContainerStyle: {
            paddingLeft: 10,
          },
          headerTitle: "Profil",
        }}
      />
      <ProfileStackNavigator.Screen
        name="DeleteAnnonceValidationScreen"
        component={DeleteAnnonceValidationScreen}
        options={{
          headerShown: false,
        }}
      />
      <ProfileStackNavigator.Screen
        name="ContactScreen"
        component={ContactScreen}
        options={{
          headerRightContainerStyle: {
            paddingRight: 10,
          },
          headerBackTitle: "Retour",
          headerLeftContainerStyle: {
            paddingLeft: 10,
          },
          headerTitle: "Contactez-nous",
        }}
      />
      <ProfileStackNavigator.Screen
        name="ModifierEmailConfirmationScreen"
        component={ModifierEmailConfirmationScreen}
        options={{
          headerShown: false,
        }}
      />
      <ProfileStackNavigator.Screen
        name="ValidationLitigeScreen"
        component={ValidationLitigeScreen}
        options={{
          headerShown: false,
        }}
      />
      <ProfileStackNavigator.Screen
        name="PreAuthScreen"
        component={PreAuthScreen}
        options={{
          headerRightContainerStyle: {
            paddingRight: 10,
          },
          headerBackTitle: "Retour",
          headerLeftContainerStyle: {
            paddingLeft: 10,
          },
          headerTitle: "Identification",
        }}
      />
      <ProfileStackNavigator.Screen
        name="CommentCaMarcheScreen"
        component={CommentCaMarcheScreen}
        options={{
          headerRightContainerStyle: {
            paddingRight: 10,
          },
          headerBackTitle: "Retour",
          headerLeftContainerStyle: {
            paddingLeft: 10,
          },
          headerTitle: "Comment ca marche",
        }}
      />
      <ProfileStackNavigator.Screen
        name="PhotoModifierAnnonceScreen"
        component={PhotoModifierAnnonceScreen}
        options={{
          headerRightContainerStyle: {
            paddingRight: 10,
          },
          headerBackTitle: "Retour",
          headerLeftContainerStyle: {
            paddingLeft: 10,
          },
          headerTitle: "Photo",
        }}
      />
      <ProfileStackNavigator.Screen
        name="EnterIbanScreen"
        component={EnterIbanScreen}
        options={{
          headerRightContainerStyle: {
            paddingRight: 10,
          },
          headerBackTitle: "Retour",
          headerLeftContainerStyle: {
            paddingLeft: 10,
          },
          headerTitle: "Saisissez votre IBAN",
        }}
      />
      <ProfileStackNavigator.Screen
        name="ValidationIBANScreen"
        component={ValidationIBANScreen}
        options={{
          headerShown: false,
        }}
      />
      <ProfileStackNavigator.Screen
        name="ValidationAnnonceModifieeScreen"
        component={ValidationAnnonceModifieeScreen}
        options={{
          headerShown: false,
        }}
      />
      <ProfileStackNavigator.Screen
        name="ModifierAnnonceScreen"
        component={ModifierAnnonceScreen}
        options={{
          headerRightContainerStyle: {
            paddingRight: 10,
          },
          headerBackTitle: "Retour",
          headerLeftContainerStyle: {
            paddingLeft: 10,
          },
          headerTitle: "Modifier votre annonce",
        }}
      />
      <ProfileStackNavigator.Screen
        name="ValidationContactScreen"
        component={ValidationContactScreen}
        options={{
          headerRightContainerStyle: {
            paddingRight: 10,
          },
          headerBackTitle: "Retour",
          headerLeftContainerStyle: {
            paddingLeft: 10,
          },
          headerTitle: "Contactez-nous",
        }}
      />
      <ProfileStackNavigator.Screen
        name="ProductDetailScreen"
        children={ProductDetailScreen}
        options={{
          title: "Details",
          headerStyle: {
            backgroundColor: "white",
          },
          headerTitleStyle: {
            color: "black",
          },
          headerBackTitle: "Retour",
          headerBackTitleStyle: {
            color: "black",
          },
          headerTitleAlign: "center",
        }}
      />
      <ProfileStackNavigator.Screen
        name="PortefeuilleScreen"
        component={PortefeuilleScreen}
        options={{
          headerRightContainerStyle: {
            paddingRight: 10,
          },
          headerLeftContainerStyle: {
            paddingLeft: 10,
          },
          headerBackTitle: "Retour",
          headerTitle: "Mon portefeuille",
          headerTitleStyle: {
            marginLeft: 50,
          },
        }}
      />
      <ProfileStackNavigator.Screen
        name="ArticlesEnVenteScreen"
        component={ArticlesEnVenteScreen}
        options={{
          headerRightContainerStyle: {
            paddingRight: 10,
          },
          headerLeftContainerStyle: {
            paddingLeft: 10,
          },
          headerBackTitle: "Retour",
          headerTitle: "Mes articles en vente",
          headerTitleStyle: {
            marginLeft: 50,
          },
        }}
      />
      <ProfileStackNavigator.Screen
        name="BoosteVenteScreen"
        component={BoosteVenteScreen}
        options={{
          headerRightContainerStyle: {
            paddingRight: 10,
          },
          headerLeftContainerStyle: {
            paddingLeft: 10,
          },
          headerBackTitle: "Retour",
          headerTitle: "Booste tes ventes !",
        }}
      />
      <ProfileStackNavigator.Screen
        name="MesCommandesScreen"
        component={MesCommandesScreen}
        options={{
          headerRightContainerStyle: {
            paddingRight: 10,
          },
          headerLeftContainerStyle: {
            paddingLeft: 10,
          },
          headerBackTitle: "Retour",
          headerTitle: "Mes commandes",
          headerTitleStyle: {
            marginLeft: 50,
          },
        }}
      />
      <ProfileStackNavigator.Screen
        name="CommandeDetailScreen"
        component={CommandeDetailScreen}
        options={{
          headerRightContainerStyle: {
            paddingRight: 10,
          },
          headerLeftContainerStyle: {
            paddingLeft: 10,
          },
          headerBackTitle: "Retour",
          headerTitle: "Détail de la commande",
        }}
      />
      <ProfileStackNavigator.Screen
        name="EvaluationScreen"
        component={EvaluationScreen}
        options={{
          headerRightContainerStyle: {
            paddingRight: 10,
          },
          headerLeftContainerStyle: {
            paddingLeft: 10,
          },
          headerBackTitle: "Retour",
          headerTitle: "Evaluation",
        }}
      />
      <ProfileStackNavigator.Screen
        name="ValidationEvaluationScreen"
        component={ValidationEvaluationScreen}
        options={{
          headerShown: false,
        }}
      />
      <ProfileStackNavigator.Screen
        name="BoosteVentePaiementScreen"
        component={BoosteVentePaiementScreen}
        options={{
          headerRightContainerStyle: {
            paddingRight: 10,
          },
          headerLeftContainerStyle: {
            paddingLeft: 10,
          },
          headerBackTitle: "Retour",
          headerTitle: "Booste tes ventes !",
        }}
      />
      <ProfileStackNavigator.Screen
        name="InformationsScreen"
        component={InformationsScreen}
        options={{
          headerRightContainerStyle: {
            paddingRight: 10,
          },
          headerLeftContainerStyle: {
            paddingLeft: 10,
          },
          headerBackTitle: "Retour",
          headerTitle: "Mes informations",
          headerTitleStyle: {
            marginLeft: 50,
          },
        }}
      />

      <ProfileStackNavigator.Screen
        name="ModifierAdresseScreen"
        component={ModifierAdresseScreen}
        options={{
          headerRightContainerStyle: {
            paddingRight: 10,
          },
          headerLeftContainerStyle: {
            paddingLeft: 10,
          },
          headerTitle: "Modifier mon adresse",
          headerBackTitle: "Retour",
        }}
      />
      <ProfileStackNavigator.Screen
        name="ModifierEmailScreen"
        component={ModifierEmailScreen}
        options={{
          headerRightContainerStyle: {
            paddingRight: 10,
          },
          headerTitle: "Modifier mon email",
          headerLeftContainerStyle: {
            paddingLeft: 10,
          },
          headerBackTitle: "Retour",
        }}
      />
      <ProfileStackNavigator.Screen
        name="ModifierPseudoScreen"
        component={ModifierPseudoScreen}
        options={{
          headerRightContainerStyle: {
            paddingRight: 10,
          },
          headerLeftContainerStyle: {
            paddingLeft: 10,
          },
          headerTitle: "Modifier mon pseudo",
          headerBackTitle: "Retour",
        }}
      />
      <ProfileStackNavigator.Screen
        name="SignalerUnLitigeScreen"
        component={SignalerUnLitigeScreen}
        options={{
          headerRightContainerStyle: {
            paddingRight: 10,
          },
          headerLeftContainerStyle: {
            paddingLeft: 10,
          },
          headerBackTitle: "Retour",
          headerTitle: "Signaler un litige",
        }}
      />
      <ProfileStackNavigator.Screen
        name="MentionLegaleScreen"
        component={MentionLegaleScreen}
        options={{
          headerRightContainerStyle: {
            paddingRight: 10,
          },
          headerLeftContainerStyle: {
            paddingLeft: 10,
          },
          headerBackTitle: "Retour",
          headerTitle: "Mentions Légales",
        }}
      />
      <ProfileStackNavigator.Screen
        name="CGUScreen"
        component={CGUScreen}
        options={(props) => ({
          headerRightContainerStyle: {
            paddingRight: 10,
          },
          headerLeftContainerStyle: {
            paddingLeft: 10,
          },
          headerBackVisible: true,
          headerBackTitle: "Retour",
          headerTitle: "CGU & CGV",
        })}
      />
      <ProfileStackNavigator.Screen
        name="ViePriveeScreen"
        component={ViePriveeScreen}
        options={{
          headerRightContainerStyle: {
            paddingRight: 10,
          },
          headerLeftContainerStyle: {
            paddingLeft: 10,
          },
          headerBackTitle: "Retour",
          headerTitle: "Vie Privée",
        }}
      />
    </ProfileStackNavigator.Navigator>
  );
};

export const AccueilNavigator = (props) => {
  let totalQuantity = 0;
  const cartItems = useSelector((state) => {
    const transformedCartItems = [];
    for (const key in state.cart.items) {
      transformedCartItems.push({
        productId: key,
        productTitle: state.cart.items[key].productTitle,
        productPrice: state.cart.items[key].productPrice,
        quantity: state.cart.items[key].quantity,
        sum: state.cart.items[key].sum,
      });
    }
    return transformedCartItems;
  });

  for (let data in cartItems) {
    totalQuantity += parseFloat(cartItems[data].quantity);
  }
  console.log("totalQuantity", totalQuantity);
  console.log("cartItems", cartItems);

  return (
    <AccueilStackNavigator.Navigator>
      <AccueilStackNavigator.Screen
        name="AccueilScreen"
        component={AccueilScreen}
        options={{
          headerRightContainerStyle: {
            paddingRight: 10,
          },
          headerLeftContainerStyle: {
            paddingLeft: 10,
          },
          headerTitleStyle: {
            marginBottom: 20,
          },
          headerRight: () => (
            <View>
              <View
                style={{
                  backgroundColor: "#D51317",
                  borderRadius: 30,
                  alignItems: "center",
                  position: "absolute",
                  width: 20,
                  bottom: "65%",
                  right: "55%",
                }}
              >
                <Text style={{ color: "white", fontWeight: "bold" }}>
                  {totalQuantity}
                </Text>
              </View>
              <Fontisto
                name="shopping-basket"
                size={24}
                color="#D51317"
                onPress={() =>
                  props.navigation.navigate("Acheter", {
                    screen: "FirstCartScreen",
                  })
                }
              />
            </View>
          ),
          headerTitle: () => <CustomHeader {...props} />,
        }}
      />
      <AccueilStackNavigator.Screen
        name="ProductDetailScreen"
        component={ProductDetailScreen}
        options={{
          headerRightContainerStyle: {
            paddingRight: 10,
          },
          headerLeftContainerStyle: {
            paddingLeft: 10,
          },
          headerRight: () => (
            <View>
              <View
                style={{
                  backgroundColor: "#D51317",
                  borderRadius: 30,
                  alignItems: "center",
                  position: "absolute",
                  width: 20,
                  bottom: "65%",
                  right: "55%",
                }}
              >
                <Text style={{ color: "white", fontWeight: "bold" }}>
                  {totalQuantity}
                </Text>
              </View>
              <Fontisto
                name="shopping-basket"
                size={24}
                color="#D51317"
                onPress={() => props.navigation.navigate("FirstCartScreen")}
              />
            </View>
          ),
          headerBackTitle: "Retour",
          headerTitle: "Details",
        }}
      />
    </AccueilStackNavigator.Navigator>
  );
};

const resetStackOnTabPress = ({ navigation, route }) => ({
  tabPress: (e) => {
    const state = navigation.dangerouslyGetState();

    if (state) {
      // Grab all the tabs that are NOT the one we just pressed
      const nonTargetTabs = state.routes.filter((r) => r.key !== e.target);

      nonTargetTabs.forEach((tab) => {
        // Find the tab we want to reset and grab the key of the nested stack
        const tabName = tab?.name;
        const stackKey = tab?.state?.key;

        if (stackKey) {
          // Pass the stack key that we want to reset and use popToTop to reset it
          navigation.dispatch({
            ...StackActions.popToTop(),
            target: stackKey,
          });
        }
      });
    }
  },
});

export const TabNavigator = (props) => {
  const { loggedInAsVisit, setLoggedInAsVisit } = props;

  const dispatch = useDispatch();
  //console.log("auth", firebase.auth().currentUser.uid);
  const [count, setCount] = useState(0);

  useEffect(() => {
    dispatch(messageAction.fetchUnreadMessage());
  }, [dispatch]);

  const message = useSelector((state) => state.messages.unreadMessages);
  console.log("message", message);
  const messageLength = message.length;

  return (
    <>
      {props.loggedInAsVisit ? (
        <AppTabNavigator.Navigator
          tabBarOptions={{
            activeTintColor: "red",
            activeBackgroundColor: "white",
            inactiveBackgroundColor: "white",
          }}
        >
          <AppTabNavigator.Screen
            name="Accueil"
            component={AccueilNavigator}
            listeners={resetStackOnTabPress}
            options={{
              tabBarIcon: ({ color, size }) => (
                <AntDesign name="home" size={24} color="black" />
              ),
            }}
          />
          <AppTabNavigator.Screen
            name="Acheter"
            children={(props) => (
              <AchatNavigator
                {...props}
                loggedInAsVisit={loggedInAsVisit}
                setLoggedInAsVisit={setLoggedInAsVisit}
              />
            )}
            listeners={resetStackOnTabPress}
            options={{
              tabBarIcon: ({ color, size }) => (
                <Entypo name="shopping-cart" size={24} color="black" />
              ),
            }}
          />
          <AppTabNavigator.Screen
            name="Vendre"
            listeners={resetStackOnTabPress}
            children={() => <></>}
            options={{
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="md-add-circle" size={24} color="black" />
              ),
              tabBarButton: (props) => (
                <TouchableOpacity
                  {...props}
                  onPress={() => setLoggedInAsVisit(!loggedInAsVisit)}
                />
              ),
            }}
          />
          <AppTabNavigator.Screen
            name="Message"
            children={() => <></>}
            listeners={resetStackOnTabPress}
            options={{
              tabBarIcon: ({ color, size }) => (
                <View>
                  <View
                    style={{
                      backgroundColor: "#D51317",
                      borderRadius: 30,
                      alignItems: "center",
                      position: "absolute",
                      width: 20,
                      bottom: "65%",
                      right: "55%",
                    }}
                  >
                    <Text style={{ color: "white", fontWeight: "bold" }}>
                      1
                    </Text>
                  </View>
                  <AntDesign name="message1" size={24} color="black" />
                </View>
              ),
              tabBarButton: (props) => (
                <TouchableOpacity
                  {...props}
                  onPress={() => setLoggedInAsVisit(!loggedInAsVisit)}
                />
              ),
            }}
          />
          <AppTabNavigator.Screen
            name="Profil"
            children={() => <></>}
            listeners={resetStackOnTabPress}
            options={{
              tabBarIcon: ({ color, size }) => (
                <AntDesign name="user" size={24} color="black" />
              ),
              tabBarButton: (props) => (
                <TouchableOpacity
                  {...props}
                  onPress={() => setLoggedInAsVisit(!loggedInAsVisit)}
                />
              ),
            }}
          />
        </AppTabNavigator.Navigator>
      ) : (
        <AppTabNavigator.Navigator
          tabBarOptions={{
            activeTintColor: "red",
            activeBackgroundColor: "white",
            inactiveBackgroundColor: "white",
          }}
        >
          <AppTabNavigator.Screen
            name="Accueil"
            component={AccueilNavigator}
            listeners={resetStackOnTabPress}
            options={{
              tabBarIcon: ({ color, size }) => (
                <AntDesign name="home" size={24} color="black" />
              ),
            }}
          />
          <AppTabNavigator.Screen
            name="Acheter"
            children={(props) => (
              <AchatNavigator
                {...props}
                loggedInAsVisit={loggedInAsVisit}
                setLoggedInAsVisit={setLoggedInAsVisit}
              />
            )}
            listeners={resetStackOnTabPress}
            options={{
              tabBarIcon: ({ color, size }) => (
                <Entypo name="shopping-cart" size={24} color="black" />
              ),
            }}
          />
          <AppTabNavigator.Screen
            name="Vendre"
            listeners={resetStackOnTabPress}
            children={(props) => (
              <SellNavigator
                {...props}
                loggedInAsVisit={loggedInAsVisit}
                setLoggedInAsVisit={setLoggedInAsVisit}
              />
            )}
            options={{
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="md-add-circle" size={24} color="black" />
              ),
            }}
          />
          <AppTabNavigator.Screen
            name="Message"
            listeners={resetStackOnTabPress}
            component={MessageNavigator}
            options={{
              tabBarIcon: ({ color, size }) => (
                <View>
                  {messageLength > 1 ? (
                    <View
                      style={{
                        backgroundColor: "#D51317",
                        borderRadius: 30,
                        alignItems: "center",
                        position: "absolute",
                        width: 18,
                        bottom: "45%",
                        left: "25%",
                      }}
                    >
                      <Text style={{ color: "white", fontWeight: "bold" }}>
                        {messageLength - 1}
                      </Text>
                    </View>
                  ) : (
                    <View />
                  )}
                  <AntDesign name="message1" size={24} color="black" />
                </View>
              ),
            }}
          />
          <AppTabNavigator.Screen
            name="Profil"
            component={ProfileNavigator}
            listeners={resetStackOnTabPress}
            options={{
              tabBarIcon: ({ color, size }) => (
                <AntDesign name="user" size={24} color="black" />
              ),
            }}
          />
        </AppTabNavigator.Navigator>
      )}
    </>
  );
};

const styles = StyleSheet.create({});

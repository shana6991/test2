import streamlit as st
import pandas as pd
import numpy as np
from scipy.interpolate import interp1d

# Données pour une prime de 300 CHF



values_0_percent_300 = np.array([1.087, 2.205, 3.317, 4.423, 5.523, 9.004, 12.466, 15.911, 19.336, 22.744,
                                 26.133, 29.504, 32.856, 36.189, 39.503, 42.798, 46.074, 49.331, 52.568,
                                 55.785, 58.983, 62.159, 65.315, 68.448, 71.561, 74.651, 77.719, 80.764,
                                 83.785, 86.783, 89.759, 92.711, 95.642, 98.549, 101.434])

values_1_percent_300 = np.array([1.093, 2.228, 3.368, 4.513, 5.664, 9.219, 12.791, 16.380, 19.986, 23.608,
                                 27.246, 30.901, 34.573, 38.260, 41.963, 45.682, 49.417, 53.168, 56.935,
                                 60.715, 64.511, 68.320, 72.144, 75.980, 79.829, 83.691, 87.565, 91.451,
                                 95.348, 99.255, 103.174, 107.105, 111.048, 115.002, 118.967])

values_2_percent_300 = np.array([1.099, 2.251, 3.419, 4.605, 5.808, 9.440, 13.127, 16.867, 20.661, 24.511,
                                 28.417, 32.379, 36.399, 40.477, 44.613, 48.808, 53.063, 57.378, 61.755,
                                 66.193, 70.693, 75.255, 79.880, 84.568, 89.320, 94.137, 99.018, 103.964,
                                 108.976, 114.054, 119.200, 124.414, 129.699, 135.054, 140.481])

values_3_percent_300 = np.array([1.105, 2.274, 3.471, 4.698, 5.955, 10.268, 14.400, 18.755, 23.344, 28.179,
                                 33.272, 38.636, 44.285, 50.231, 56.491, 63.079, 70.013, 77.308, 84.983,
                                 93.056, 101.546, 110.473, 119.859, 129.726, 140.096, 150.994, 162.445,
                                 174.477, 187.116, 200.393, 214.338, 228.985, 244.367, 260.520, 280.523])

values_4_percent_300 = np.array([1.111, 2.297, 3.524, 4.793, 6.106, 9.902, 13.830, 17.894, 22.097, 26.446,
                                 30.944, 35.598, 40.412, 45.390, 50.540, 55.867, 61.377, 67.075, 72.969,
                                 79.063, 85.366, 91.883, 98.622, 105.589, 112.793, 120.241, 127.941,
                                 135.901, 144.130, 152.637, 161.433, 170.526, 179.928, 189.650, 199.700])

values_6_percent_300 = np.array([1.122, 2.343, 3.630, 4.988, 6.419, 10.391, 14.580, 18.997, 23.655, 28.566,
                                 33.743, 39.203, 44.960, 51.030, 57.428, 64.175, 71.288, 78.787, 86.694,
                                 95.028, 103.815, 113.077, 122.841, 133.133, 143.982, 155.418, 167.472,
                                 180.178, 193.570, 207.687, 222.568, 238.255, 254.792, 272.226, 290.605])

values_7_percent_300 = np.array([1.126, 2.356, 3.662, 5.031, 6.475, 10.524, 14.748, 19.205, 23.908, 28.873,
                                 34.116, 39.656, 45.511, 51.701, 58.248, 65.175, 72.506, 80.268, 88.487,
                                 97.192, 106.409, 116.169, 126.506, 137.454, 149.051, 161.338, 174.354,
                                 188.137, 202.724, 218.160, 234.489, 251.756, 270.007, 289.287, 309.643])

values_8_percent_300 = np.array([1.134, 2.390, 3.739, 5.189, 6.746, 10.907, 15.379, 20.183, 25.344, 30.889,
                                 36.846, 43.246, 50.122, 57.508, 65.443, 73.967, 83.125, 92.963, 103.532,
                                 114.885, 127.081, 140.182, 154.255, 169.372, 185.611, 203.054, 221.792,
                                 241.920, 263.541, 286.767, 311.717, 338.521, 367.317, 398.253, 431.488])

values_9_percent_300 = np.array([1.140, 2.413, 3.794, 5.291, 6.915, 11.176, 15.798, 20.808, 26.242, 32.133,
                                 38.521, 45.448, 52.959, 61.102, 69.931, 79.505, 89.886, 101.141, 113.345,
                                 126.576, 140.922, 156.476, 173.341, 191.625, 211.449, 232.943, 256.246,
                                 281.513, 308.907, 338.610, 370.815, 405.736, 443.602, 484.662, 529.185])


# Données pour une prime de 588 CHF




values_0_percent_588 = np.array([2.234, 4.493, 6.739, 8.974, 11.197, 18.086, 24.939, 31.756, 38.537, 45.281,
                                 51.989, 58.660, 65.294, 71.891, 78.450, 84.972, 91.456, 97.902, 104.310,
                                 110.678, 117.006, 123.292, 129.538, 135.741, 141.900, 148.017, 154.089,
                                 160.115, 166.095, 172.029, 177.918, 183.761, 189.561, 195.315, 201.024])

values_1_percent_588 = np.array([2.246, 4.539, 6.843, 9.158, 11.483, 18.523, 25.596, 32.701, 39.840, 47.012,
                                 54.216, 61.452, 68.722, 76.022, 83.355, 90.719, 98.115, 105.541, 112.998,
                                 120.484, 127.999, 135.542, 143.112, 150.708, 158.329, 165.976, 173.647,
                                 181.340, 189.055, 196.793, 204.552, 212.334, 220.140, 227.969, 235.819])

values_2_percent_588 = np.array([2.258, 4.586, 6.948, 9.345, 11.776, 18.971, 26.273, 33.681, 41.197, 48.823,
                                 56.559, 64.407, 72.369, 80.446, 88.638, 96.948, 105.376, 113.924, 122.593,
                                 131.384, 140.298, 149.334, 158.495, 167.782, 177.194, 186.735, 196.403,
                                 206.200, 216.127, 226.185, 236.377, 246.706, 257.173, 267.781, 278.529])

values_3_percent_588 = np.array([2.270, 4.633, 7.054, 10.123, 13.018, 20.899, 29.209, 37.972, 47.212, 56.955,
                                 67.227, 78.059, 89.479, 101.520, 114.216, 127.600, 141.712, 156.590,
                                 172.275, 188.810, 206.242, 224.618, 243.988, 264.407, 285.930, 308.618,
                                 332.532, 357.739, 384.309, 412.316, 441.838, 472.960, 505.769, 540.357,
                                 576.819])

values_4_percent_588 = np.array([2.282, 4.680, 7.161, 10.533, 13.683, 19.908, 27.694, 35.749, 44.082, 52.702,
                                 61.619, 70.844, 80.386, 90.256, 100.465, 111.024, 121.946, 133.242,
                                 144.925, 157.006, 169.500, 182.419, 195.777, 209.589, 223.870, 238.634,
                                 253.898, 269.678, 285.991, 302.855, 320.290, 338.315, 356.953, 376.224,
                                 396.148])

values_6_percent_588 = np.array([2.306, 4.775, 7.378, 10.742, 14.027, 20.899, 29.209, 37.972, 47.212, 56.955,
                                 67.227, 78.059, 89.479, 101.520, 114.216, 127.600, 141.712, 156.590,
                                 172.275, 188.810, 206.242, 224.618, 243.988, 264.407, 285.930, 308.618,
                                 332.532, 357.739, 384.309, 412.316, 441.838, 472.960, 505.769, 540.357,
                                 576.819])

values_7_percent_588 = np.array([2.321, 4.867, 7.628, 10.622, 13.867, 22.245, 31.310, 41.138, 51.790, 63.334,
                                 75.842, 89.393, 104.072, 119.969, 137.185, 155.825, 176.005, 197.848,
                                 221.489, 247.071, 274.751, 304.697, 337.090, 372.124, 410.013, 450.984,
                                 495.281, 543.171, 594.938, 650.893, 711.369, 776.726, 847.353, 923.668,
                                 1016.927])

values_8_percent_588 = np.array([2.330, 4.871, 7.600, 10.533, 13.683, 21.946, 30.824, 40.362, 50.610, 61.619,
                                 73.447, 86.154, 99.805, 114.471, 130.226, 147.152, 165.335, 184.868,
                                 205.853, 228.395, 252.611, 278.623, 306.566, 336.581, 368.824, 403.459,
                                 440.664, 480.629, 523.558, 569.674, 619.214, 672.434, 729.610, 791.035,
                                 857.025])

values_9_percent_588 = np.array([2.342, 4.918, 7.713, 10.742, 14.027, 22.492, 31.672, 41.625, 52.417, 64.120,
                                 76.809, 90.567, 105.485, 121.661, 139.200, 158.216, 178.835, 201.192,
                                 225.433, 251.715, 280.212, 311.108, 344.606, 380.925, 420.303, 462.997,
                                 509.287, 559.475, 613.890, 672.890, 736.862, 806.228, 881.443, 963.003,
                                 1051.441])

# Fonction pour calculer la valeur de rachat et les frais
def calculate_values_and_fees(prime, interest_rate, years):
    base_rates = [0, 1, 2, 3, 4, 6, 7, 8, 9]
    
    # Données pour 300 CHF et 588 CHF
    data_300 = np.vstack([values_0_percent_300, values_1_percent_300, values_2_percent_300,
                          values_3_percent_300, values_4_percent_300, values_6_percent_300,
                          values_7_percent_300, values_8_percent_300, values_9_percent_300]).T
    data_588 = np.vstack([values_0_percent_588, values_1_percent_588, values_2_percent_588,
                          values_3_percent_588, values_4_percent_588, values_6_percent_588,
                          values_7_percent_588, values_8_percent_588, values_9_percent_588]).T

    # Interpolateurs pour les taux
    interpolator_300 = interp1d(base_rates, data_300, axis=1, kind='linear', fill_value="extrapolate")
    interpolator_588 = interp1d(base_rates, data_588, axis=1, kind='linear', fill_value="extrapolate")

    # Estimation des valeurs pour le taux d'intérêt donné
    values_300 = interpolator_300(interest_rate)[:years]
    values_588 = interpolator_588(interest_rate)[:years]

    # Échelle pour la prime
    ratio = (prime - 300) / (588 - 300)
    estimated_values = values_300 + ratio * (values_588 - values_300)

    # Multiplication et arrondi des valeurs
    estimated_values *= 1000
    estimated_values = np.round(estimated_values).astype(int)

    # Calcul des primes cumulées
    prime_annuelle = prime * 12
    primes_cumulees = np.array([prime_annuelle * (i + 1) for i in range(years)])

    # Calcul des frais pour chaque année
    previous_value = 0
    fees = []

    for n, valeur_rachats_n in enumerate(estimated_values):
        if n == 0:
            # Frais pour la première année
            frais_n = prime_annuelle - valeur_rachats_n
        else:
            # Frais pour les années suivantes
            valeur_attendue = (previous_value * (1 + interest_rate / 100)) + prime_annuelle
            frais_n = valeur_attendue - valeur_rachats_n
        
        # Correction : remplacer les frais négatifs par 0
        frais_n = max(frais_n, 0)
        fees.append(round(frais_n))
        previous_value = valeur_rachats_n

    return primes_cumulees, estimated_values, np.array(fees)

# Application Streamlit
st.title("Frais et Pourcentage de Gain/Perte")
st.write("Calculez les valeurs de rachat, les frais associés, le montant cumulé des primes versées et le pourcentage de gain ou de perte pour chaque année.")

# Entrées utilisateur
prime = st.number_input("Prime mensuelle (CHF)", min_value=1, step=1, value=350)
interest_rate = st.number_input("Taux de rendement (%)", step=0.1, value=6.0)
years = st.number_input("Durée du contrat (années)", min_value=1, max_value=35, step=1, value=35)

# Calcul des valeurs et frais
primes_cumulees, values, fees = calculate_values_and_fees(prime, interest_rate, years)

if values is not None and fees is not None:
    years_display = np.arange(1, years + 1)

    # Calcul du pourcentage de gain ou de perte
    gain_perte = ((values - primes_cumulees) / primes_cumulees) * 100

    # Calcul du pourcentage des frais
    pourcentage_frais = (fees / primes_cumulees) * 100

    # Création du DataFrame
    results_df = pd.DataFrame({
        "Année": years_display,
        "Montant cumulé des primes versées (CHF)": primes_cumulees,
        "Valeur estimée (CHF)": values,
        "Pourcentage de gain/perte (%)": gain_perte,
        "Frais (CHF)": fees,
        "Pourcentage des frais (%)": pourcentage_frais
    })

    # Affichage des résultats
    st.write("### Résultats des Prédictions")
    st.dataframe(results_df)

    # Option de téléchargement
    csv = results_df.to_csv(index=False).encode('utf-8')
    st.download_button(
        label="Télécharger les résultats (CSV)",
        data=csv,
        file_name=f"predictions_frais_gain_perte_prime_{prime}_taux_{interest_rate}.csv",
        mime="text/csv"
    )
else:
    st.error("Impossible de calculer les valeurs pour cette combinaison de paramètres.")

import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.linear_model import LogisticRegression

print("✅ Tous les modules sont importés avec succès par mettez votre nom !")

# Mini test : graphique seaborn
data = pd.DataFrame({
"vitesse": np.random.normal(80, 15, 100),
"danger": np.random.choice([safe, danger], 100)
})

sns.boxplot(x="danger", y="vitesse", data=data)
plt.title("Exemple graphique : vitesse selon danger")
plt.show()
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, TextInput, FlatList, Switch } from 'react-native';
import colors from './color';
import { AntDesign } from '@expo/vector-icons';

// Types définissant les données pour une tâche et une liste
interface Task {
  id: number; // Identifiant unique de la tâche
  name: string; // Nom de la tâche
  completed: boolean; // Indique si la tâche est terminée
}

interface List {
  id: number; // Identifiant unique de la liste
  name: string; // Nom de la liste
  tasks: Task[]; // Liste des tâches associées
}

const App: React.FC = () => {
  // État pour gérer toutes les listes
  const [lists, setLists] = useState<List[]>([]);
  // État pour le nom d'une nouvelle liste
  const [newListName, setNewListName] = useState<string>('');
  // État pour savoir si l'utilisateur est en train d'ajouter une liste
  const [isAdding, setIsAdding] = useState<boolean>(false);
  // État pour stocker la liste actuellement sélectionnée
  const [currentList, setCurrentList] = useState<List | null>(null);
  // État pour le nom d'une nouvelle tâche
  const [newTaskName, setNewTaskName] = useState<string>('');
  //supprimer une liste
  const deleteList = (listId: number) => {
    setLists(lists.filter((list) => list.id !== listId)); // Filtre les listes en excluant celle avec l'ID donné
  };
  

  // Fonction pour ajouter une nouvelle liste
  const addList = () => {
    if (newListName.trim() === '') return; // Empêche l'ajout d'une liste vide
    const newList = {
      id: Date.now(), // Génère un identifiant unique basé sur le timestamp
      name: newListName, // Nom saisi par l'utilisateur
      tasks: [], // Liste initialement vide
    };
    setLists([...lists, newList]); // Ajoute la nouvelle liste à l'état global
    setNewListName(''); // Réinitialise le champ de saisie
    setIsAdding(false); // Ferme l'interface d'ajout
  };

  // Fonction pour ajouter une tâche à la liste sélectionnée
  const addTask = () => {
    if (!currentList || newTaskName.trim() === '') return; // Empêche l'ajout de tâche sans nom
    const newTask = {
      id: Date.now(), // Identifiant unique
      name: newTaskName, // Nom saisi par l'utilisateur
      completed: false, // Tâche non terminée par défaut
    };
    // Met à jour uniquement la liste courante avec la nouvelle tâche
    const updatedList = { ...currentList, tasks: [...currentList.tasks, newTask] };
    setLists(lists.map((list) => (list.id === currentList.id ? updatedList : list))); // Met à jour l'état global
    setCurrentList(updatedList); // Met à jour l'état local
    setNewTaskName(''); // Réinitialise le champ de saisie
  };

  // Fonction pour basculer l'état "terminé" d'une tâche
  const toggleTaskCompletion = (taskId: number) => {
    if (!currentList) return; // Vérifie qu'une liste est sélectionnée
    const updatedTasks = currentList.tasks.map((task) =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    );
    const updatedList = { ...currentList, tasks: updatedTasks };
    setLists(lists.map((list) => (list.id === currentList.id ? updatedList : list))); // Met à jour la liste dans l'état global
    setCurrentList(updatedList); // Met à jour l'état local
  };

  // Fonction pour ouvrir une liste et afficher ses tâches
  const openList = (list: List) => {
    setCurrentList(list); // Définit la liste actuelle
  };

  // Fonction pour revenir à la liste principale
  const goBack = () => {
    setCurrentList(null); // Réinitialise l'état de la liste sélectionnée
  };

  // Fonction pour supprimer une tâche
const deleteTask = (taskId: number) => {
  if (!currentList) return; // Vérifie qu'une liste est sélectionnée
  const updatedTasks = currentList.tasks.filter((task) => task.id !== taskId); // Filtre la tâche à supprimer
  const updatedList = { ...currentList, tasks: updatedTasks };
  setLists(lists.map((list) => (list.id === currentList.id ? updatedList : list))); // Met à jour la liste dans l'état global
  setCurrentList(updatedList); // Met à jour l'état local
};


  return (
    <View style={styles.container}>
      {/* Vue principale affichant les listes si aucune n'est sélectionnée */}
      {!currentList ? (
        <>
          {/* En-tête avec le titre principal */}
          <View style={styles.header}>
            <View style={styles.divider} />
            <Text style={styles.title}>
              Todo <Text style={{ fontWeight: '300', color: colors.pink }}>List</Text>
            </Text>
            <View style={styles.divider} />
          </View>

          {/* Bouton pour ajouter une nouvelle liste */}
          <View style={{ alignItems: 'center', marginVertical: 48 }}>
            <TouchableOpacity style={styles.addList} onPress={() => setIsAdding(true)}>
              <AntDesign name="plus" size={30} color={colors.pink} />
            </TouchableOpacity>
            <Text style={styles.add}>Add List</Text>
          </View>


          {/* Interface d'ajout de liste si l'utilisateur clique sur le bouton "+" */}
          {isAdding && (
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Nom de la nouvelle liste"
                value={newListName}
                onChangeText={setNewListName}
              />
              <TouchableOpacity style={styles.addList} onPress={addList}>
                <Text style={styles.add}>Ajouter</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Liste des listes existantes */}
          <FlatList
            data={lists}
            renderItem={({ item }) => (
              <View style={styles.listContainer}>
                <TouchableOpacity style={styles.listItem} onPress={() => openList(item)}>
                  <Text style={styles.listText}>{item.name}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => deleteList(item.id)}>
                  <AntDesign name="delete" size={20} color={colors.pink} />
               </TouchableOpacity>
              </View>
            )}
            keyExtractor={(item) => item.id.toString()}
          />

        </>
      ) : (
        /* Vue affichant les tâches d'une liste sélectionnée */
        <>
          {/* Bouton pour revenir à la liste principale */}
          <TouchableOpacity onPress={goBack} style={styles.goBack}>
            <AntDesign name="arrowleft" size={24} color={colors.pink} />
            <Text style={styles.goBackText}>Back</Text>
          </TouchableOpacity>

          {/* Titre de la liste actuelle */}
          <Text style={styles.title}>{currentList.name}</Text>

          {/* Interface d'ajout de tâches */}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Nouvelle tâche"
              value={newTaskName}
              onChangeText={setNewTaskName}
            />
            <TouchableOpacity style={styles.addList} onPress={addTask}>
              <Text style={styles.add}>Ajouter</Text>
            </TouchableOpacity>
          </View>

          {/* Liste des tâches avec un switch pour marquer les tâches comme terminées */}
          <FlatList
            data={currentList.tasks}
            renderItem={({ item }) => (
              <View style={styles.taskItem}>
                <Switch
                  value={item.completed}
                  onValueChange={() => toggleTaskCompletion(item.id)}
                />
                <Text
                  style={[
                    styles.taskText,
                    item.completed && { textDecorationLine: 'line-through', color: colors.pinkLight },
                  ]}
                >
                  {item.name}
                </Text>
                {/* Bouton pour supprimer une tâche */}
                <TouchableOpacity onPress={() => deleteTask(item.id)}>
                  <AntDesign name="delete" size={20} color={colors.pink} />
                </TouchableOpacity>
              </View>
            )}
            keyExtractor={(item) => item.id.toString()}
          />
        </>
      )}
    </View>
  );
};

export default App;

// Styles pour l'application
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    marginTop: 30
  },
  divider: {
    backgroundColor: colors.black,
    height: 1,
    flex: 1,
    marginHorizontal: 8,
  },
  title: {
    fontSize: 30,
    color: colors.black,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  addList: {
    width: 140, // Largeur du bouton
    height: 40, // Hauteur du bouton
    borderWidth: 1,
    borderColor: colors.pinkLight,
    borderRadius: 4,
    padding: 4,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },
  add: {
    color: colors.pink,
    fontWeight: '600',
    fontSize: 14,
    marginTop: 8,
  },
  inputContainer: {
    marginTop: 30,
    alignItems: 'center',
  },
  input: {
    width: 200,
    borderWidth: 1,
    borderColor: colors.pinkLight,
    padding: 10,
    marginBottom: 10,
    borderRadius: 4,
    textAlign: 'center',
  },
  listItem: {
    backgroundColor: colors.pink,
    padding: 10,
    marginVertical: 5,
    borderRadius: 4,
    alignItems: 'center',
  },
  listText: {
    fontSize: 18,
    color: colors.white,
  },
  listContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginVertical: 5,
  },  
  goBack: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    marginLeft: 16,
  },
  goBackText: {
    fontSize: 16,
    color: colors.pink,
    marginLeft: 8,
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
    paddingHorizontal: 16,
    
  },
  taskText: {
    fontSize: 18,
    margin: 10,
    color: colors.pink,
  },
});

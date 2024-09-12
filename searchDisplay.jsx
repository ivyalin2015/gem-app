// filter data based on what's entered in searchbar
const search = (data, query) => {
    if (data) {
      return data.filter((item) => item.name.includes(query));
    }
  };
  // display the contents when you're in the searchbar
  const display = (data) => {
    if (data) {
      return data.map(({ uid, name, username, profilePic }) => {
        return (
          <View>
            <MyComponent
              uid={uid}
              name={name}
              username={"@" + username}
              image={profilePic}
              buttonStyle={styles.button}
            />
          </View>
        );
      });
    }
  };

  const displayRequests = (data) => {
    if (data) {
      return data.map(({ uid, name, username, profilePic }) => {
        return (
          <View>
            <MyComponent
              uid={uid}
              name={name}
              username={"@" + username}
              image={profilePic}
              buttonStyle={styles.button}
            />
          </View>
        );
      });
    }
  }

  // searchbar functionality
  function searchBar() {
    return (
      <View style={styles.container}>
        <View>
          <TextInput
            style={styles.search}
            text={query}
            type="text"
            placeholder="Search..."
            className="search"
            onChangeText={(text) => {
              setQuery(text);
            }}
          />
        </View>

        <Text style={{ fontSize: 24, padding: 10 }}>Recommended</Text>
        {display(search(data, query))}
      </View>
    )
}
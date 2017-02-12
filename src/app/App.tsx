import { h, Component, ComponentProps } from 'preact';
import { Button, Card, Icon, Layout, Navigation, TextField } from 'preact-mdl';
import { Router } from 'preact-router';

export const App = () => {
  return (
    <div id="app">
      <Layout
        fixed-header
        fixed-drawer
        ref={ ( input ) => { this.layout = input; } }>
        <Header onSearch={ () => { return; } } />
        <Sidebar onDrawerClick={ this.toggleDrawer } />

        <Button id="fab" fab colored onClick={ this.handleFab }>
          <Icon icon="create" />
        </Button>

        <Layout.Content>
          <Router>
            <Home path="/" default />
            <Profile path="/profile" id="me" />
            <Profile path="/profile/:id" id="" />
          </Router>
        </Layout.Content>
      </Layout>
    </div>
  );
};


type HeaderProps = ComponentProps & { onSearch: ((event: KeyboardEvent) => boolean|void) };
const Header = ( { onSearch }: HeaderProps ) => (
  <Layout.Header>
    <Layout.HeaderRow>
      <Layout.Title>
        <a href="/">Example</a>
      </Layout.Title>
      <Layout.Spacer />
      <TextField
        placeholder="Search"
        type="search"
        onSearch={ onSearch }
        style="background-color:#FFF; color:#000; padding:10px;"
      />
    </Layout.HeaderRow>
  </Layout.Header>
);

type SidebarProps = ComponentProps & { onDrawerClick: ((event: MouseEvent) => boolean|void) };
class Sidebar extends Component<SidebarProps, {}> {
  shouldComponentUpdate() {
    return false;
  }

  render( { onDrawerClick }: SidebarProps ) {
    return (
      <Layout.Drawer onClick={ onDrawerClick }>
        <Layout.Title>Example App</Layout.Title>
        <Navigation>
          <Navigation.Link href="/">Home</Navigation.Link>
          <Navigation.Link href="/profile">Profile</Navigation.Link>
          <Navigation.Link href="/profile/john">John</Navigation.Link>
        </Navigation>
      </Layout.Drawer>
    );
  }
}

interface RouterProps extends JSX.HTMLAttributes {
  default?: boolean;
  path: string;
}

class Home extends Component<RouterProps, {}> {
  shouldComponentUpdate() {
    return false;
  }

  render() {
    return (
      <Card shadow={ 4 }>
        <Card.Title class="graphic">
          <Card.TitleText>Home</Card.TitleText>
        </Card.Title>
        <Card.Text style="text-align:center">
          <Icon icon="person" style="display:block; font-size:100px;" />
          <p>Nothing to see here.</p>
        </Card.Text>
        <Card.Actions style="text-align:right">
          <Button primary>Click Me</Button>
        </Card.Actions>
      </Card>
    );
  }
}

type ProfileProps = ComponentProps & RouterProps & { id?: string };
class Profile extends Component<ProfileProps & RouterProps, {}> {
  shouldComponentUpdate( { id }: ProfileProps ) {
    return id !== this.props.id;
  }

  render( { id }: ProfileProps ) {
    return (
      <div class="profile">
        <Card shadow={ 3 } class="wide">
          <Card.Title class="graphic">
            <Card.TitleText>User: { id }</Card.TitleText>
          </Card.Title>

          <Card.Text>
            <p>This is a profile for the user { id }.</p>
          </Card.Text>
        </Card>
      </div>
    );
  }
}


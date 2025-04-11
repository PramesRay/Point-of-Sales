export type ConfigProps = {
  Sidebar_drawer: boolean;
  Customizer_drawer: boolean;
  mini_sidebar: boolean;
  fontTheme: string;
  inputBg: boolean;
};

const config: ConfigProps = {
  Sidebar_drawer: false,
  Customizer_drawer: false,
  mini_sidebar: false,
  fontTheme: 'Roboto',
  inputBg: false
};

export default config;

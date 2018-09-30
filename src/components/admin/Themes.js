import Enumerable from 'linq';
import { Component } from 'react';

class Themes extends Component {
   
    static defaultTheme = {
        light: '#90CAF9',
        main: '#2196F3',
        dark: '#1E88E5',
        contrastText: '#fff',
    }

    static themeColors = [
        {
            light: '#90CAF9',
            main: '#2196F3',
            dark: '#1E88E5',
            contrastText: '#fff',
        },
        {
            light: '#80CBC4',
            main: '#009688',
            dark: '#00897B',
            contrastText: '#fff',
        },

        {
            light: '#EEEEEE',
            main: '#9E9E9E',
            dark: '#757575',
            contrastText: '#fff',
        },

        {
            light: '#EF9A9A',
            main: '#F44336',
            dark: '#E53935',
            contrastText: '#fff',
        },
        {
            light: '#9FA8DA',
            main: '#3F51B5',
            dark: '#3949AB',
            contrastText: '#fff',
        },
        {
            light: '#FFAB91',
            main: '#FF5722',
            dark: '#F4511E',
            contrastText: '#fff',
        },
        {
            light: '#F48FB1',
            main: '#E91E63',
            dark: '#D81B60',
            contrastText: '#fff',
        },
        {
            light: '#80DEEA',
            main: '#00BCD4',
            dark: '#00ACC1',
            contrastText: '#fff',
        },
    ]

    static async getCurrentTheme(userId) {
        let userThemeColors = this.defaultTheme;
        const response = await fetch(`http://127.0.0.1:8080/getUserTheme?userId=${userId}`);
        const data = await response.json();
        if (data[0])
            userThemeColors = Enumerable.from(this.themeColors).where(t => t.main === data[0].theme_color).firstOrDefault();
        return userThemeColors;
    }
}
export default Themes;
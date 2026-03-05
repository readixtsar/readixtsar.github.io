

const content_dir = 'contents/'
const config_file = 'config.yml'
const section_names = ['home', 'Call for Papers', 'Organization', 'Registration', 'Acknowledgements']


window.addEventListener('DOMContentLoaded', event => {

    // Activate Bootstrap scrollspy on the main nav element
    const mainNav = document.body.querySelector('#mainNav');
    if (mainNav) {
        new bootstrap.ScrollSpy(document.body, {
            target: '#mainNav',
            offset: 74,
        });
    };

    // Collapse responsive navbar when toggler is visible
    const navbarToggler = document.body.querySelector('.navbar-toggler');
    const responsiveNavItems = [].slice.call(
        document.querySelectorAll('#navbarResponsive .nav-link')
    );
    responsiveNavItems.map(function (responsiveNavItem) {
        responsiveNavItem.addEventListener('click', () => {
            if (window.getComputedStyle(navbarToggler).display !== 'none') {
                navbarToggler.click();
            }
        });
    });


    // Yaml
    fetch(content_dir + config_file)
        .then(response => response.text())
        .then(text => {
            const yml = jsyaml.load(text);
            Object.keys(yml).forEach(key => {
                try {
                    document.getElementById(key).innerHTML = yml[key];
                } catch {
                    console.log("Unknown id and value: " + key + "," + yml[key].toString())
                }

            })
        })
        .catch(error => console.log(error));


    // Marked
    marked.use({ mangle: false, headerIds: false })
    section_names.forEach((name, idx) => {
        fetch(content_dir + name + '.md')
            .then(response => response.text())
            .then(markdown => {

                // If the markdown file is wrapped in triple-backtick fences (e.g. ```markdown),
                // unwrap it so the markdown renders normally.
                const trimmed = markdown.trim();
                if (trimmed.startsWith('```')) {
                    const firstNewline = markdown.indexOf('\n');
                    const lastFence = markdown.lastIndexOf('```');
                    if (firstNewline !== -1 && lastFence > firstNewline) {
                        markdown = markdown.slice(firstNewline + 1, lastFence);
                    }
                }

                const html = marked.parse(markdown);
                const target = document.getElementById(name + '-md');
                if (target) {
                    target.innerHTML = html;
                }
            })
            .catch(error => console.log(error));
    })

}); 

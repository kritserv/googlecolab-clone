<!doctype html>
<html lang="en">
    <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Untitled project</title>
        <link type="text/css" href="/static/styles.css" rel="stylesheet">
        <link id="favicon-link" rel="shortcut icon" href="/static/img_favicon.ico">

        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/codemirror/6.65.7/codemirror.min.css">
        <script src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/6.65.7/codemirror.min.js"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/6.65.7/mode/python/python.min.js"></script>

    </head>

    <body>
        <header>
            <nav>
                <div id="header-logo">
                    <a class="colab-large-icon">
                        <svg viewBox="0 0 24 24"><!--?lit$074587426$-->
                            <g id="colab-logo">
                                <path d="M4.54,9.46,2.19,7.1a6.93,6.93,0,0,0,0,9.79l2.36-2.36A3.59,3.59,0,0,1,4.54,9.46Z" style="fill:orange"></path>
                                <path d="M2.19,7.1,4.54,9.46a3.59,3.59,0,0,1,5.08,0l1.71-2.93h0l-.1-.08h0A6.93,6.93,0,0,0,2.19,7.1Z" style="fill:gold"></path>
                                <path d="M11.34,17.46h0L9.62,14.54a3.59,3.59,0,0,1-5.08,0L2.19,16.9a6.93,6.93,0,0,0,9,.65l.11-.09" style="fill:gold"></path>
                                <path d="M12,7.1a6.93,6.93,0,0,0,0,9.79l2.36-2.36a3.59,3.59,0,1,1,5.08-5.08L21.81,7.1A6.93,6.93,0,0,0,12,7.1Z" style="fill:gold"></path>
                                <path d="M21.81,7.1,19.46,9.46a3.59,3.59,0,0,1-5.08,5.08L12,16.9A6.93,6.93,0,0,0,21.81,7.1Z" style="fill:orange"></path>
                            </g>
                        </svg>
                    </a>
                </div>
                <p class="project-name">Untitled project</p>
            </nav>
            <a href="/add_cell">+ Code</a>
            <hr/>
        </header>
        <main>
            <p>Codes: <b>{{ len(codes) }}</b></p>
            <ol type="i">
                %for index, code in enumerate(codes):
                <li class="code-container">
                    <div class="code-tools">
                        <a href="/delete_cell/{{ index }}">🗑️</a>
                        %if index > 0:
                            <a href="/move_up/{{ index }}">⬆️</a>
                        %end
                        %if index < len(codes)-1:
                            <a href="/move_down/{{ index }}">⬇️</a>
                        %end
                    </div>
                    <form id="form{{ index }}">
                        <table>
                            <tr>
                                <td><a href="javascript:;" onclick="document.getElementById('form{{ index }}').submit()">▶</a></td>
                                <td style="width:90vw;"><textarea class="code" name="code">{{ code }}</textarea></td>
                            </tr>
                            %if results[index] or errors[index]:
                            <tr>
                                <td></td>
                                <td>
                                    <div class="code-result">
                                        <p>{{ results[index] }}</p>
                                        <p class="error">{{ errors[index] }}</p>
                                    </div>
                                </td>
                            </tr>
                            %end
                        </table>
                        <input type="hidden" name="index" value="{{ index }}">
                    </form>
                </li>
                %end
            </ol>
        </main>

        <script>
          document.querySelectorAll('.code').forEach((textarea, idx) => {
            const editor = CodeMirror.fromTextArea(textarea, {
              lineNumbers: false,
              mode: 'python',
              indentUnit: 4
            });

            const form = textarea.closest('form');
            form.addEventListener('submit', () => {
              editor.save();
            });
          });
        </script>
    </body>
</html>

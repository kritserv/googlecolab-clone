from bottle import route, run, template, get, static_file, request, redirect, abort
from json import dump, load, JSONDecodeError

save_file = 'data.json'

@get("/static/<filepath:path>")
def serve_static(filepath):
    allowed_extensions = (".css", ".js", ".ico")
    if filepath.endswith(allowed_extensions):
        return static_file(filepath, root="static")
    abort(403, "Forbidden file type")

def load_save_file():
    try:
        with open(save_file, 'r') as f:
            save_data = load(f)
            return save_data['codes'], save_data['results'], save_data['errors']
    except (FileNotFoundError, KeyError, JSONDecodeError):
        return [], [], []

def save_save_file(codes, results, errors):
    with open(save_file, 'w') as f:
        dump({'codes': codes, 'results': [str(result) for result in results], 'errors': errors}, f)


@route('/add_cell')
def add_cell():
    codes, results, errors = load_save_file()
    codes.append('')
    results.append('')
    errors.append('')
    save_save_file(codes, results, errors)
    return redirect('/')

@route('/delete_cell/<index:int>')
def delete_cell(index):
    codes, results, errors = load_save_file()
    index = int(index)
    if 0 <= index < len(codes):
        del codes[index]
        del results[index]
        del errors[index]
        save_save_file(codes, results, errors)
    return redirect('/')

@route('/move_up/<index:int>')
def move_up(index):
    codes, results, errors = load_save_file()
    index = int(index)

    if 0 < index < len(codes):
        codes[index], codes[index-1] = codes[index-1], codes[index]
        results[index], results[index-1] = results[index-1], results[index]
        errors[index], errors[index-1] = errors[index-1], errors[index]
        save_save_file(codes, results, errors)

    return redirect('/')

@route('/move_down/<index:int>')
def move_down(index):
    codes, results, errors = load_save_file()
    index = int(index)

    if 0 <= index < len(codes) - 1:
        codes[index], codes[index+1] = codes[index+1], codes[index]
        results[index], results[index+1] = results[index+1], results[index]
        errors[index], errors[index+1] = errors[index+1], errors[index]
        save_save_file(codes, results, errors)

    return redirect('/')

@route('/')
def index():
    codes, results, errors = load_save_file()
    code = request.params.get('code', '')
    index = request.params.get('index', '')

    if code and index:
        try:
            index = int(index)
            result = ''
            error = ''
            global_list = []

            for line in code.split('\n'):
                if not line.startswith(' '):
                    variable = False
                    if '=' in line:
                        if not '+=' in line and not '-=' in line and not '*=' in line and not '/=' in line:
                            variable = line.split('=')[0]
                            variable = variable.strip()
                    if 'def' in line:
                        variable = line.split('def')[1].split('(')[0].strip()
                    if 'class' in line:
                        variable = line.split('class')[1].split('(')[0].split(':')[0].strip()
                    if 'import' in line:
                        variable = line.split('import')[1].split('as')[-1].strip()
                    if variable:
                        global_list.append(f"global {variable}")

            try:
                code_with_globals = '\n'.join(global_list) + '\n' + code
                print(code_with_globals)
                exec(code_with_globals)
                last_line = code.split('\n')[-1]
                if '=' not in last_line and last_line != '' and last_line != '"""' and last_line != "'''" and not last_line.startswith(' ') and not last_line.startswith('from') and not last_line.startswith('import'):
                    if 'print' in last_line:
                        last_line = last_line.replace('print(','')[:-1]
                    last_line = last_line.strip()
                    result = eval(last_line)
            except Exception as e:
                error = str(e)

            if 0 <= index < len(codes):
                codes[index] = code
                results[index] = result
                errors[index] = error
                save_save_file(codes, results, errors)
        except (ValueError, IndexError) as e:
            print(e)

    return template('index', codes=codes, results=results, errors=errors)

run(host='localhost', port=8080, reloader=True, debug=True)

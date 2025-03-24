this project is very bad, I'm just doing it for fun

use jupyter notebook https://jupyter.org/ if you want to run colab locally. 



## how this project works

when execute a cell, the script will collect every variables and save it to global variables, so it can be access by other cell.

the result of each cell is detected by last line, then dump string from result to json file.

## installation

```
git clone https://github.com/kritserv/googlecolab-clone.git
```

```
cd googlecolab-clone
```

```
pip install -r requirements.txt
```

```
py main.py
```

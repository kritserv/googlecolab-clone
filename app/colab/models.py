from django.db import models

# Create your models here.

class Cell(models.Model):
	index = models.IntegerField(default=0)
	content = models.TextField()

class Project(models.Model):
	title = models.CharField(max_length=30)
	cells = models.ForeignKey(Cell, on_delete=models.CASCADE)
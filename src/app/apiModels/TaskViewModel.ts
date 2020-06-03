import { TaskModel } from './TaskModel';
import { TaskModelList } from './TasksModelList';
import { TaskCommentsModelList } from './TaskCommentsModelList';

export class TaskViewModel{
    Task : TaskModel;
    Comments : TaskCommentsModelList;
}
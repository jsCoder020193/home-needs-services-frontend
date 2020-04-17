import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class Services {

  serviceCategoeies = [];
  serviceSubCategories = [];

  constructor() { }

  setServices(data){
    data.forEach(element => {
      var path = element['path'].toString().split('>')[0];
      var subPath = element['path'].toString().split('>')[1];
      if(subPath)
        this.serviceSubCategories.push({id: element['id'], parent_id: element['services_id_parent_fk'], parent: path, title: subPath});
      else
        this.serviceCategoeies.push({id: element['id'], title: path});
    });
  }

  getParentServices(){
    return this.serviceCategoeies;
  }
  
  getChildServices(){
    return this.serviceSubCategories;
  }

}

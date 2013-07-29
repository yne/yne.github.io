package lpql.agilespider.servlet;

import java.util.ArrayList;
import java.util.HashMap;

import lpql.agilespider.bdd.Epic;
import lpql.agilespider.bdd.A_Item;
import lpql.agilespider.bdd.ORM;


import com.google.gson.Gson;

public class Main {
	public static void main(String[] args) {
		ORM db = new ORM();
		try {
			db.connect("localhost:3306/mindmap", "mindmap","");
			A_Item test = db.getItemById("Epic", 2);
			System.out.println(test.get("epic_name"));
	        System.out.println(new Gson().toJson(test));
			//do stuff
		} catch (Exception e) {
			System.err.println("unable to connect");
		}
		db.disconnect();
	}
}

/*
getAll :
		HashMap<String,ArrayList<Object>> items=new HashMap<String,ArrayList<Object>>();
		items.put("project"  , db.getAll("Project"));
		items.put("epic"     , db.getAll("Epic"));
		items.put("userstory", db.getAll("UserStory"));
		items.put("scenario" , db.getAll("Scenario"));
        System.out.println(new Gson().toJson(items));
findById :
		Epic e = (Epic) db.getItemById("Epic",1);
		System.out.println(e.get("epic_name"));
* */

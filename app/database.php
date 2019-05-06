<?php
/**
 * Created by PhpStorm.
 * User: NANDHU
 * Date: 1/10/2019
 * Time: 10:51 PM
 */

class database
{
    private $host="localhost";
    private $user="root";
    private $pass="";
    private $dbname="project";
    private $dbh;
    public $error;
    private $stmt;
    public function __construct()
    {
        $dsn='mysql:host='.$this->host.';dbname='.$this->dbname;
        $option=array(
            PDO::ATTR_PERSISTENT => true,
            PDO::ATTR_ERRMODE =>PDO::ERRMODE_EXCEPTION
        );
        try
        {
            $this->dbh=new PDO($dsn,$this->user,$this->pass,$option);
        }
        catch (PDOException $e)
        {
            $this->error=$e->getMessage();
        }

    }
    public function query($query)
    {
        $this->stmt=$this->dbh->prepare($query);
    }
    public function bind($param,$value,$type=null)
    {
        if(is_null($type))
        {
            switch (true)
            {
                case is_int($value) :$type=PDO::PARAM_INT;
                                        break;
                case is_bool($value):$type=PDO::PARAM_BOOL;
                                        break;
                case is_null($value):$type=PDO::PARAM_NULL;
                                        break;
                default : $type=PDO::PARAM_STR;

            }
        }
        $this->stmt->bindvalue($param,$value);
    }
    public function execute()
    {
        return $this->stmt->execute();
    }
    public function resultset()
    {
        $this->execute();
        return $this->stmt->fetchAll(PDO::FETCH_OBJ);
    }
    public function lastInsertedId()
    {
        return $this->dbh->lastInsertId();
    }
}
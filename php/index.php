<?php
error_reporting(E_STRICT);

require 'vendor/autoload.php';
$config = parse_ini_file('app.ini');

class CrateResource extends \Slim\Slim
{
    public $conn;
    public $config;

    function __construct($config)
    {
        parent::__construct();
        $this->config = $config;
        $dsn = "{$config['db_host']}:{$config['db_port']}";
        $this->conn = new Crate\PDO\PDO($dsn, null, null, null);
    }

    function refreshTable($table)
    {
        $qry = $this->conn->prepare("REFRESH TABLE {$table}");
        $result = $qry->execute();
    }

    function argument_required($message)
    {
        $this->resource_error(400, $message);
    }

    function not_found($message)
    {
        $this->resource_error(404, $message);
    }

    function resource_error($status, $message, $contenttype = 'application/json')
    {
        $this->response->headers->set('Content-Type', $contenttype);
        $this->response->setStatus($status);
        $this->response->write(json_encode(array(
            "error" => $message,
            "status" => $status
        )));
    }

    function success($status, $result, $contenttype = 'application/json')
    {
        $this->response->headers->set('Content-Type', $contenttype);
        $this->response->setStatus($status);
        $this->response->write(json_encode($result));
    }
}

$app = new CrateResource($config);
// apply CORS headers to all responses
$app->add(new \CorsSlim\CorsSlim());

/**
 * Default action.
 */
$app->get('/', function() use ($app)
{
    $app->success(200, 'Server up and running');
})->name('default');

/**
 * Get the post for a given id.
 */
//$app->get('/post/:id', function($id) use ($app)
//{
//    $qry = $app->conn->prepare("SELECT p.*, c.name as country, c.geometry as area
//            FROM guestbook.posts AS p, guestbook.countries AS c
//            WHERE within(p.user['location'], c.geometry) AND p.id = ?");
//    $qry->bindParam(1, $id);
//    $qry->execute();
//    $result = $qry->fetch(PDO::FETCH_ASSOC);
//    if (!$result) {
//        $app->not_found("Post with id=\"{$id}\" not found");
//    } else {
//        $app->success(200, $result);
//    }
//})->name('post-get');

/**
 * Get the project for a given id.
 */
$app->get('/project/:id', function($id) use ($app)
{
   $qry = $app->conn->prepare("SELECT *
           FROM showcase.projects AS p
           WHERE p.id = ?");
   $qry->bindParam(1, $id);
   $qry->execute();
   $result = $qry->fetch(PDO::FETCH_ASSOC);
   if (!$result) {
       $app->not_found("Project with id=\"{$id}\" not found");
   } else {
       $app->success(200, $result);
   }
})->name('project-get');

/**
 * insert a project.
 */
$app->post('/projects', function() use ($app)
{
    $data            = json_decode($app->request->getBody());
    $title           = $data->title;
    $description     = $data->description;
    $url             = $data->url;
    $year            = $data->year;
    $campus_ids      = $data->campus_ids;
    $category_ids    = $data->category_ids;
    $discipline_ids  = $data->discipline_ids;
    $tags            = $data->tags;
    $image_ref       = $data->image_ref;
    $people          = $data->people;

    // error_log(print_r($people, TRUE) . " ttt\n", 3, "/var/tmp/my-errors.log");
    // error_log($people[0]->name_first . " fff\n", 3, "/var/tmp/my-errors.log");
    // error_log(json_encode($people) . " fff\n", 3, "/var/tmp/my-errors.log");

    if (empty($title)) {
        $app->argument_required('Argument "Title" is required');
        return;
    } else if (empty($description)) {
        $app->argument_required('Argument "Description" is required');
        return;
    }else if (empty($url)) {
        $app->argument_required('Argument "URL" is required');
        return;
    }else if (empty($year)) {
        $app->argument_required('Argument "Year" is required');
        return;
    }else if (empty($campus_ids)) {
        $app->argument_required('Argument "Campus" is required');
        return;
    }else if (empty($category_ids)) {
        $app->argument_required('Argument "Category" is required');
        return;
    }else if (empty($discipline_ids)) {
        $app->argument_required('Argument "Discipline" is required');
        return;
    }else if (empty($tags)) {
        $app->argument_required('Argument "Tags" is required');
        return;
    }else if (empty($image_ref)) {
        $app->argument_required('Argument "Image" is required');
        return;
    }else if (empty($people)) {
        $app->argument_required('Argument "People" is required');
        return;
    }

    $id        = uniqid();
    $now       = time() * 1000;
    $likeCount = 0;
    $qry       = $app->conn->prepare("INSERT INTO showcase.projects (
      id, title, description, url, year, campus_ids, category_ids, discipline_ids, tags, image_ref, people
    ) VALUES (
      ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
    )");
    $qry->bindParam(1, $id);
    $qry->bindParam(2, $title);
    $qry->bindParam(3, $description);
    $qry->bindParam(4, $url);
    $qry->bindParam(5, $year);
    $qry->bindParam(6, $campus_ids);
    $qry->bindParam(7, $category_ids);
    $qry->bindParam(8, $discipline_ids);
    $qry->bindParam(9, $tags);
    $qry->bindParam(10, $image_ref);
    $qry->bindParam(11, $people);
    $state = $qry->execute();


//Currently Breaks post for some reason.

   if ($state) {
       $app->refreshTable('showcase.projects');
       $qry = $app->conn->prepare("SELECT p.* FROM showcase.projects AS p WHERE p.id = ?");
       $qry->bindParam(1, $id);
       $qry->execute();
    //    $result = $qry->fetchAll(PDO::FETCH_ASSOC);
       $result = array(
            "success"=>"Project Created!",
            "id" => $id   
        );
       $app->success(201, $result, $id);
   } else {
       $app->resource_error(500, $app->conn->errorInfo());
   }

})->name('post-project');


/**
 * edits a project with a given id.
 */
$app->put('/project/:id/edit', function($id) use ($app)
{
    $data            = json_decode($app->request->getBody());
    $title           = $data->title;
    $description     = $data->description;
    $url             = $data->url;
    $year            = $data->year;
    $campus_ids      = $data->campus_ids;
    $category_ids    = $data->category_ids;
    $discipline_ids  = $data->discipline_ids;
    $tags            = $data->tags;
    $image_ref       = $data->image_ref;
    $people          = $data->people;

    // error_log($campus_ids[1] . "\n", 3, "/var/tmp/my-errors.log");

    if (empty($title)) {
        $app->argument_required('Argument "Title" is required');
        return;
    }else if (empty($description)) {
        $app->argument_required('Argument "Description" is required');
        return;
    }else if (empty($url)) {
        $app->argument_required('Argument "URL" is required');
        return;
    }else if (empty($year)) {
        $app->argument_required('Argument "Year" is required');
        return;
    }else if (empty($campus_ids)) {
        $app->argument_required('Argument "Campus" is required');
        return;
    }else if (empty($category_ids)) {
        $app->argument_required('Argument "Category" is required');
        return;
    }else if (empty($discipline_ids)) {
        $app->argument_required('Argument "Discipline" is required');
        return;
    }else if (empty($tags)) {
        $app->argument_required('Argument "Tags" is required');
        return;
    }else if (empty($image_ref)) {
        $app->argument_required('Argument "Image" is required');
        return;
    }else if (empty($people)) {
        $app->argument_required('Argument "People" is required');
        return;
    }

    $qry = $app->conn->prepare("UPDATE showcase.projects
                                SET title = ?,
                                description =?,
                                url=?,
                                year=?,
                                campus_ids=?,
                                category_ids=?,
                                discipline_ids=?,
                                tags=?,
                                image_ref=?,
                                people=?
                                WHERE id=?");
    $qry->bindParam(1, $title);
    $qry->bindParam(2, $description);
    $qry->bindParam(3, $url);
    $qry->bindParam(4, $year);
    $qry->bindParam(5, $campus_ids);
    $qry->bindParam(6, $category_ids);
    $qry->bindParam(7, $discipline_ids);
    $qry->bindParam(8, $tags);
    $qry->bindParam(9, $image_ref);
    $qry->bindParam(10, $people);
    $qry->bindParam(11, $id);
    $state = $qry->execute();
})->name('project-put');

/**
 * deletes a project with a given id.
 */
$app->delete('/projects/:id', function($id) use ($app)
{
    if (empty($id)) {
        $app->not_found('Please provide a post id: /projects/<id>');
        return;
    }
    $qry = $app->conn->prepare("SELECT * FROM showcase.projects WHERE id = ?");
    $qry->bindParam(1, $id);
    $qry->execute();
    $result = $qry->fetchAll(PDO::FETCH_ASSOC);
    if (!$result) {
        $app->not_found("Post with id=\"{$id}\" not found");
        return;
    }

    $qry = $app->conn->prepare("DELETE FROM showcase.projects WHERE id=?");
    $qry->bindParam(1, $id);
    $state = $qry->execute();

    if ($state) {
      $app->response->setStatus(204);
    } else {
      // nothing deleted?
      $app->not_found("Post with id=\"{$id}\" not deleted");
    }
})->name('project-delete');


/**
 * Get a list of all campuses.
 */
$app->get('/campuses', function() use ($app)
{
    $qry = $app->conn->prepare("SELECT c.*
            FROM showcase.campuses AS c");
    $qry->execute();
    $result = $qry->fetchAll(PDO::FETCH_ASSOC);
    $app->success(200, $result);
})->name('campuses-get');

/**
 * Get a list of all categories.
 */
$app->get('/categories', function() use ($app)
{
    $qry = $app->conn->prepare("SELECT c.*
            FROM showcase.categories AS c");
    $qry->execute();
    $result = $qry->fetchAll(PDO::FETCH_ASSOC);
    $app->success(200, $result);
})->name('categories-get');


/**
 * Get a list of all disciplines.
 */
$app->get('/disciplines', function() use ($app)
{
    $qry = $app->conn->prepare("SELECT c.*
            FROM showcase.disciplines AS c");
    $qry->execute();
    $result = $qry->fetchAll(PDO::FETCH_ASSOC);
    $app->success(200, $result);
})->name('disciplines-get');


/**
 * Get a list of all projects.
 */
$app->get('/projects', function() use ($app)
{
    $qry = $app->conn->prepare("SELECT p.*
            FROM showcase.projects AS p");
    $qry->execute();
    $result = $qry->fetchAll(PDO::FETCH_ASSOC);
    $app->success(200, $result);
})->name('projects-get');





/**
 * returns all images that are saved in the crate blob store.
 */
$app->get('/images', function() use ($app)
{
    $qry = $app->conn->prepare("SELECT digest, last_modified FROM blob.project_images");
    $qry->execute();
    $result = $qry->fetchAll(PDO::FETCH_ASSOC);
    $app->success(200, $result);
})->name('images-get');

/**
 * inserts an image
 */
$app->post('/images', function() use ($app)
{
    $data = json_decode($app->request->getBody());
    if (!isset($data->blob)) {
        $app->argument_required('Argument "blob" is required');
        return;
    }
    $content = base64_decode($data->blob);
    $digest  = sha1($content);
    $ch      = curl_init("{$app->config['blob_url']}project_images/{$digest}");
    curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "PUT");
    curl_setopt($ch, CURLOPT_POSTFIELDS, $content);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    $result = curl_exec($ch);
    $info   = curl_getinfo($ch);
    if ($info['http_code'] != 201) {
        $app->resource_error($info['http_code'], curl_error($ch));
    } else {
        $app->success($info['http_code'], array(
            'url' => "/image/{$digest}",
            'digest' => $digest
        ));
    }
})->name('image-post');

/**
 * returns the image for a given digest.
 */
$app->get('/image/:digest', function($digest) use ($app)
{
    if (empty($digest)) {
        $app->not_found('Please provide an image digest: /image/<digest>');
        return;
    }
    $ch     = curl_init("{$app->config['blob_url']}project_images/{$digest}");
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    $result = curl_exec($ch);
    if (!$result || is_bool($result)) {
        $info = curl_getinfo($ch);
        $app->not_found("Image with digest=\"{$digest}\" not found");
    } else {
        $app->response->headers->set("Content-Type", "image/gif");
        $app->response->headers->set("Content-Length", strlen($result));
        $app->response->setStatus(200);
        $app->response->write($result);
    }
})->name('image-get');

/**
 * deletes a image that is saved in the blobstore with the given digest.
 */
$app->delete('/image/:digest', function($digest) use ($app)
{
    if (empty($digest)) {
        $app->not_found('Please provide an image digest: /image/<digest>');
        return;
    }
    $ch = curl_init("{$app->config['blob_url']}project_images/{$digest}");
    curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "DELETE");
    $result = curl_exec($ch);
    $info   = curl_getinfo($ch);
    if ($info['http_code'] == 404) {
        $app->not_found("Image with digest=\"{$digest}\" not found");
    } else if ($info['http_code'] == 204) {
        $app->response->setStatus(204);
    } else {
        $err = curl_error($ch);
        $app->resource_error(500, "Could not delete image: {$err}");
    }
})->name('image-delete');


$app->post('/search', function() use ($app)
{
    $data = json_decode($app->request->getBody());
    if (!isset($data->query_string)) {
        $app->argument_required('Argument "query_string" is required');
        return;
    }

    // first check if input matches a campus
    $qry_campus = $app->conn->prepare("SELECT c.id, c._score
            FROM showcase.campuses AS c
            WHERE match(c.name, ?)
            ORDER BY c._score DESC");
    $qry_campus->bindParam(1, $data->query_string);
    $qry_campus->execute();
    $result_campus = $qry_campus->fetchAll(PDO::FETCH_ASSOC);
    $campus_id = $result_campus[0]['id'] ? $result_campus[0]['id'] : -1; // use -1 if no id found

    // then check if input matches a category
    $qry_category = $app->conn->prepare("SELECT c.id, c._score
            FROM showcase.categories AS c
            WHERE match(c.name, ?)
            ORDER BY c._score DESC");
    $qry_category->bindParam(1, $data->query_string);
    $qry_category->execute();
    $result_category = $qry_category->fetchAll(PDO::FETCH_ASSOC);
    $category_id = $result_category[0]['id'] ? $result_category[0]['id'] : -1; // use -1 if no id found

    // then check if input matches a discpline
    $qry_discipline = $app->conn->prepare("SELECT c.id, c._score
            FROM showcase.disciplines AS c
            WHERE match(c.name, ?)
            ORDER BY c._score DESC");
    $qry_discipline->bindParam(1, $data->query_string);
    $qry_discipline->execute();
    $result_discipline = $qry_discipline->fetchAll(PDO::FETCH_ASSOC);
    $discipline_id = $result_discipline[0]['id'] ? $result_discipline[0]['id'] : -1; // use -1 if no id found

    // error_log($campus_id . "\n", 3, "/var/tmp/my-errors.log");

    // lastly, do final query
    $qry = $app->conn->prepare("SELECT p.*, p._score as _score
            FROM showcase.projects AS p
            WHERE match((p.title, p.description, p.year, p.people), ?)
            OR ? = any(p.tags)
            OR ? = any(p.campus_ids)
            OR ? = any(p.category_ids)
            OR ? = any(p.discipline_ids)
            ORDER BY _score DESC");
    $qry->bindParam(1, $data->query_string);
    $qry->bindParam(2, $data->query_string);
    $qry->bindParam(3, $campus_id);
    $qry->bindParam(4, $category_id);
    $qry->bindParam(5, $discipline_id);
    $qry->execute();
    $result = $qry->fetchAll(PDO::FETCH_ASSOC);
    $app->success(200, $result);

})->name('search');

$app->run();
?>
